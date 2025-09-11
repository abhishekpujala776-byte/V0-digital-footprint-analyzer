Data Format (NER-style)

Your dataset must follow the token classification format like CoNLL:

Example (BIO tagging):

John    B-PER
lives   O
in      O
New     B-LOC
York    I-LOC
.       O
Email   O
john@gmail.com B-EMAIL

3. Code for Fine-tuning

Here’s a Hugging Face pipeline for training with extra PII entities:

from datasets import load_dataset
from transformers import AutoTokenizer, AutoModelForTokenClassification, TrainingArguments, Trainer
from transformers import DataCollatorForTokenClassification
import evaluate

# Load base dataset (CoNLL-2003)
conll = load_dataset("conll2003")

# Load your PII dataset (custom json/csv in CoNLL-style format)
pii_dataset = load_dataset("json", data_files={"train": "pii_train.json", "test": "pii_test.json"})

# Merge datasets
dataset = pii_dataset  # Or concatenate with CoNLL if needed

# Tokenizer + Model
tokenizer = AutoTokenizer.from_pretrained("dslim/bert-base-NER")
model = AutoModelForTokenClassification.from_pretrained("dslim/bert-base-NER", num_labels=8) 
# num_labels = depends on how many entity types you have (e.g., PER, LOC, ORG, EMAIL, PHONE...)

# Tokenize
def tokenize_and_align_labels(examples):
    tokenized_inputs = tokenizer(examples["tokens"], truncation=True, is_split_into_words=True)
    labels = []
    for i, label in enumerate(examples["ner_tags"]):
        word_ids = tokenized_inputs.word_ids(batch_index=i)
        previous_word_idx = None
        label_ids = []
        for word_idx in word_ids:
            if word_idx is None:
                label_ids.append(-100)
            elif word_idx != previous_word_idx:
                label_ids.append(label[word_idx])
            else:
                label_ids.append(-100)
            previous_word_idx = word_idx
        labels.append(label_ids)
    tokenized_inputs["labels"] = labels
    return tokenized_inputs

tokenized_dataset = dataset.map(tokenize_and_align_labels, batched=True)

# Training setup
data_collator = DataCollatorForTokenClassification(tokenizer)
metric = evaluate.load("seqeval")

args = TrainingArguments(
    "pii-ner-model",
    evaluation_strategy="epoch",
    save_strategy="epoch",
    learning_rate=2e-5,
    per_device_train_batch_size=8,
    num_train_epochs=3,
    weight_decay=0.01,
)

trainer = Trainer(
    model=model,
    args=args,
    train_dataset=tokenized_dataset["train"],
    eval_dataset=tokenized_dataset["test"],
    tokenizer=tokenizer,
    data_collator=data_collator,
    compute_metrics=lambda p: {"f1": metric.compute(predictions=p.predictions, references=p.label_ids)["overall_f1"]}
)

trainer.train()

# Save model
trainer.save_model("pii-ner-model")

4. Integration into Your Webpage

After fine-tuning:

Push model to Hugging Face Hub (trainer.push_to_hub()).

Use in your website backend:

from transformers import pipeline

ner_pipeline = pipeline("ner", model="your-username/pii-ner-model", tokenizer="your-username/pii-ner-model")

text = "My name is John and my email is john@gmail.com"
results = ner_pipeline(text)
print(results)


Output:

[
  {"word": "John", "entity": "B-PER", "score": 0.99},
  {"word": "john@gmail.com", "entity": "B-EMAIL", "score": 0.98}
]


✅ That’s how you extend dslim/bert-base-NER with CoNLL + PII dataset and integrate it into your site.
