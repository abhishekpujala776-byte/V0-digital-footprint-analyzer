"""
Enhanced PII Detection Training Script
Extends dslim/bert-base-NER to detect additional PII entities
"""

import json
import os
from datasets import Dataset, DatasetDict
from transformers import (
    AutoTokenizer, 
    AutoModelForTokenClassification, 
    TrainingArguments, 
    Trainer,
    DataCollatorForTokenClassification
)
import evaluate
import numpy as np

# Enhanced PII entity labels
PII_LABELS = [
    "O",           # Outside
    "B-PER",       # Person (Beginning)
    "I-PER",       # Person (Inside)
    "B-ORG",       # Organization (Beginning)
    "I-ORG",       # Organization (Inside)
    "B-LOC",       # Location (Beginning)
    "I-LOC",       # Location (Inside)
    "B-EMAIL",     # Email (Beginning)
    "I-EMAIL",     # Email (Inside)
    "B-PHONE",     # Phone Number (Beginning)
    "I-PHONE",     # Phone Number (Inside)
    "B-SSN",       # Social Security Number (Beginning)
    "I-SSN",       # Social Security Number (Inside)
    "B-CREDIT",    # Credit Card (Beginning)
    "I-CREDIT",    # Credit Card (Inside)
    "B-DATE",      # Date of Birth (Beginning)
    "I-DATE",      # Date of Birth (Inside)
    "B-ADDR",      # Address (Beginning)
    "I-ADDR",      # Address (Inside)
]

# Create label to ID mapping
label2id = {label: i for i, label in enumerate(PII_LABELS)}
id2label = {i: label for label, i in label2id.items()}

def create_sample_pii_dataset():
    """Create a sample PII dataset for training"""
    
    # Sample training data with enhanced PII entities
    sample_data = [
        {
            "tokens": ["John", "Doe", "lives", "at", "123", "Main", "Street", ",", "New", "York"],
            "ner_tags": [1, 2, 0, 0, 15, 16, 16, 0, 5, 6]  # B-PER, I-PER, O, O, B-ADDR, I-ADDR, I-ADDR, O, B-LOC, I-LOC
        },
        {
            "tokens": ["Contact", "me", "at", "john.doe@email.com", "or", "call", "555-123-4567"],
            "ner_tags": [0, 0, 0, 7, 0, 0, 9]  # O, O, O, B-EMAIL, O, O, B-PHONE
        },
        {
            "tokens": ["My", "SSN", "is", "123-45-6789", "and", "credit", "card", "4532-1234-5678-9012"],
            "ner_tags": [0, 0, 0, 11, 0, 0, 0, 13]  # O, O, O, B-SSN, O, O, O, B-CREDIT
        },
        {
            "tokens": ["Born", "on", "January", "15", ",", "1990", "in", "California"],
            "ner_tags": [0, 0, 15, 16, 16, 16, 0, 5]  # O, O, B-DATE, I-DATE, I-DATE, I-DATE, O, B-LOC
        },
        {
            "tokens": ["Sarah", "Johnson", "works", "at", "Microsoft", "Corporation"],
            "ner_tags": [1, 2, 0, 0, 3, 4]  # B-PER, I-PER, O, O, B-ORG, I-ORG
        }
    ]
    
    # Create more diverse training examples
    extended_data = []
    
    # Add variations and more examples
    for _ in range(50):  # Generate 50 additional synthetic examples
        extended_data.extend([
            {
                "tokens": ["Email", "me", "at", f"user{_}@domain.com"],
                "ner_tags": [0, 0, 0, 7]
            },
            {
                "tokens": ["Call", f"({_}00)", "555-{_:04d}"],
                "ner_tags": [0, 9, 10]
            }
        ])
    
    all_data = sample_data + extended_data
    
    # Split into train/test
    split_idx = int(0.8 * len(all_data))
    train_data = all_data[:split_idx]
    test_data = all_data[split_idx:]
    
    return DatasetDict({
        "train": Dataset.from_list(train_data),
        "test": Dataset.from_list(test_data)
    })

def tokenize_and_align_labels(examples, tokenizer):
    """Tokenize and align labels for NER training"""
    tokenized_inputs = tokenizer(
        examples["tokens"], 
        truncation=True, 
        is_split_into_words=True,
        padding=True
    )
    
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

def compute_metrics(eval_pred):
    """Compute evaluation metrics"""
    metric = evaluate.load("seqeval")
    predictions, labels = eval_pred
    predictions = np.argmax(predictions, axis=2)
    
    # Remove ignored index (special tokens)
    true_predictions = [
        [id2label[p] for (p, l) in zip(prediction, label) if l != -100]
        for prediction, label in zip(predictions, labels)
    ]
    true_labels = [
        [id2label[l] for (p, l) in zip(prediction, label) if l != -100]
        for prediction, label in zip(predictions, labels)
    ]
    
    results = metric.compute(predictions=true_predictions, references=true_labels)
    return {
        "precision": results["overall_precision"],
        "recall": results["overall_recall"],
        "f1": results["overall_f1"],
        "accuracy": results["overall_accuracy"],
    }

def train_enhanced_pii_model():
    """Train the enhanced PII detection model"""
    
    print("Creating sample PII dataset...")
    dataset = create_sample_pii_dataset()
    
    print("Loading base model and tokenizer...")
    model_name = "dslim/bert-base-NER"
    tokenizer = AutoTokenizer.from_pretrained(model_name)
    model = AutoModelForTokenClassification.from_pretrained(
        model_name, 
        num_labels=len(PII_LABELS),
        id2label=id2label,
        label2id=label2id
    )
    
    print("Tokenizing dataset...")
    tokenized_dataset = dataset.map(
        lambda examples: tokenize_and_align_labels(examples, tokenizer),
        batched=True
    )
    
    # Data collator
    data_collator = DataCollatorForTokenClassification(tokenizer)
    
    # Training arguments
    training_args = TrainingArguments(
        output_dir="./enhanced-pii-ner",
        evaluation_strategy="epoch",
        save_strategy="epoch",
        learning_rate=2e-5,
        per_device_train_batch_size=8,
        per_device_eval_batch_size=8,
        num_train_epochs=3,
        weight_decay=0.01,
        logging_dir="./logs",
        logging_steps=10,
        load_best_model_at_end=True,
        metric_for_best_model="f1",
    )
    
    # Initialize trainer
    trainer = Trainer(
        model=model,
        args=training_args,
        train_dataset=tokenized_dataset["train"],
        eval_dataset=tokenized_dataset["test"],
        tokenizer=tokenizer,
        data_collator=data_collator,
        compute_metrics=compute_metrics,
    )
    
    print("Starting training...")
    trainer.train()
    
    print("Saving model...")
    trainer.save_model("./enhanced-pii-ner-final")
    tokenizer.save_pretrained("./enhanced-pii-ner-final")
    
    # Save label mappings
    with open("./enhanced-pii-ner-final/label_mappings.json", "w") as f:
        json.dump({"id2label": id2label, "label2id": label2id}, f)
    
    print("Training completed!")
    return trainer

if __name__ == "__main__":
    trainer = train_enhanced_pii_model()
