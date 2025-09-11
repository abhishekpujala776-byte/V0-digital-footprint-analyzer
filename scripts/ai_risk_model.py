"""
AI Risk Assessment Model for Digital Footprint Analysis
Trained model for analyzing user risk based on email/phone exposure
"""

import numpy as np
import pandas as pd
from sklearn.ensemble import RandomForestClassifier
from sklearn.preprocessing import StandardScaler
import joblib
import requests
import json
from datetime import datetime
import hashlib

class DigitalRiskAnalyzer:
    def __init__(self):
        self.risk_model = None
        self.scaler = StandardScaler()
        self.breach_databases = [
            "haveibeenpwned",
            "dehashed", 
            "leakcheck",
            "intelx"
        ]
        self.social_platforms = [
            "facebook", "linkedin", "twitter", "instagram", 
            "tiktok", "snapchat", "reddit", "pinterest"
        ]
        
    def train_model(self):
        """Train the risk assessment model with synthetic data"""
        # Generate synthetic training data
        n_samples = 10000
        
        # Features: breach_count, social_exposure, account_age, password_strength, 2fa_enabled
        X = np.random.rand(n_samples, 8)
        
        # Feature engineering
        breach_count = np.random.poisson(2, n_samples)  # Average 2 breaches per user
        social_exposure = np.random.beta(2, 5, n_samples) * 100  # Skewed towards lower exposure
        account_age_years = np.random.exponential(5, n_samples)  # Average 5 years
        password_strength = np.random.choice([0, 1, 2, 3], n_samples, p=[0.3, 0.4, 0.2, 0.1])
        two_fa_enabled = np.random.choice([0, 1], n_samples, p=[0.7, 0.3])
        dark_web_mentions = np.random.poisson(1, n_samples)
        public_records = np.random.beta(1, 3, n_samples) * 50
        recent_activity = np.random.exponential(30, n_samples)  # Days since last activity
        
        X = np.column_stack([
            breach_count, social_exposure, account_age_years, 
            password_strength, two_fa_enabled, dark_web_mentions,
            public_records, recent_activity
        ])
        
        # Calculate risk score (0-100)
        risk_score = (
            breach_count * 15 +  # Each breach adds 15 points
            social_exposure * 0.3 +  # Social exposure weight
            np.maximum(0, 10 - account_age_years) * 2 +  # Newer accounts riskier
            (3 - password_strength) * 8 +  # Weak passwords add risk
            (1 - two_fa_enabled) * 12 +  # No 2FA adds risk
            dark_web_mentions * 10 +  # Dark web mentions
            public_records * 0.2 +  # Public records exposure
            np.maximum(0, 90 - recent_activity) * 0.1  # Recent activity reduces risk
        )
        
        # Normalize to 0-100 and add noise
        risk_score = np.clip(risk_score + np.random.normal(0, 5, n_samples), 0, 100)
        
        # Train the model
        self.scaler.fit(X)
        X_scaled = self.scaler.transform(X)
        
        self.risk_model = RandomForestClassifier(n_estimators=100, random_state=42)
        self.risk_model.fit(X_scaled, risk_score)
        
        # Save the model
        joblib.dump(self.risk_model, 'risk_model.pkl')
        joblib.dump(self.scaler, 'risk_scaler.pkl')
        
        print("Risk assessment model trained and saved successfully!")
        
    def load_model(self):
        """Load the trained model"""
        try:
            self.risk_model = joblib.load('risk_model.pkl')
            self.scaler = joblib.load('risk_scaler.pkl')
            return True
        except:
            print("Model not found, training new model...")
            self.train_model()
            return True
    
    def check_email_breaches(self, email):
        """Check if email appears in known breaches"""
        # Simulate breach checking (in production, use real APIs)
        email_hash = hashlib.sha1(email.encode()).hexdigest()
        
        # Simulate some emails being in breaches
        breach_indicators = [
            int(email_hash[i:i+2], 16) % 10 for i in range(0, 10, 2)
        ]
        
        breaches = []
        breach_sites = [
            "LinkedIn (2021)", "Facebook (2019)", "Twitter (2022)", 
            "Adobe (2013)", "Yahoo (2014)", "Equifax (2017)",
            "Marriott (2018)", "Capital One (2019)", "T-Mobile (2021)"
        ]
        
        for i, indicator in enumerate(breach_indicators):
            if indicator > 6:  # 30% chance of being in a breach
                breaches.append({
                    "site": breach_sites[i % len(breach_sites)],
                    "date": f"202{i % 4}",
                    "data_types": ["Email", "Password", "Personal Info"][:(i % 3) + 1]
                })
        
        return breaches
    
    def analyze_social_exposure(self, email, phone=None):
        """Analyze social media exposure"""
        # Simulate social media analysis
        username = email.split('@')[0]
        
        exposures = []
        for platform in self.social_platforms:
            # Simulate finding accounts
            if hash(username + platform) % 3 == 0:  # 33% chance of having account
                risk_level = ["Low", "Medium", "High"][hash(username + platform) % 3]
                exposures.append({
                    "platform": platform.title(),
                    "username": username,
                    "risk_level": risk_level,
                    "issues": self._generate_social_issues(risk_level)
                })
        
        return exposures
    
    def _generate_social_issues(self, risk_level):
        """Generate social media privacy issues"""
        issues = {
            "Low": ["Profile partially public"],
            "Medium": ["Location sharing enabled", "Phone number visible"],
            "High": ["Full profile public", "Personal photos exposed", "Contact info visible", "Location history public"]
        }
        return issues.get(risk_level, [])
    
    def check_dark_web_mentions(self, email):
        """Simulate dark web monitoring"""
        # Simulate dark web mentions
        email_hash = hashlib.md5(email.encode()).hexdigest()
        mention_count = int(email_hash[:2], 16) % 5  # 0-4 mentions
        
        mentions = []
        for i in range(mention_count):
            mentions.append({
                "source": f"Dark Web Forum {i+1}",
                "date": f"2024-0{(i % 9) + 1}-15",
                "context": "Credential dump",
                "severity": ["Low", "Medium", "High"][i % 3]
            })
        
        return mentions
    
    def calculate_risk_score(self, email, phone=None, additional_data=None):
        """Calculate comprehensive risk score"""
        if not self.risk_model:
            self.load_model()
        
        # Gather all risk factors
        breaches = self.check_email_breaches(email)
        social_exposures = self.analyze_social_exposure(email, phone)
        dark_web_mentions = self.check_dark_web_mentions(email)
        
        # Extract features for model
        breach_count = len(breaches)
        social_exposure_score = sum([
            {"Low": 10, "Medium": 30, "High": 50}.get(exp["risk_level"], 0) 
            for exp in social_exposures
        ])
        
        # Simulate other features
        account_age = 5.0  # Default 5 years
        password_strength = 2  # Default medium
        two_fa_enabled = 0  # Default no 2FA
        dark_web_count = len(dark_web_mentions)
        public_records = 25.0  # Default moderate exposure
        recent_activity = 30.0  # Default 30 days
        
        features = np.array([[
            breach_count, social_exposure_score, account_age,
            password_strength, two_fa_enabled, dark_web_count,
            public_records, recent_activity
        ]])
        
        # Scale features and predict
        features_scaled = self.scaler.transform(features)
        risk_score = self.risk_model.predict(features_scaled)[0]
        risk_score = max(0, min(100, risk_score))  # Ensure 0-100 range
        
        # Generate recommendations
        recommendations = self._generate_recommendations(
            risk_score, breaches, social_exposures, dark_web_mentions
        )
        
        return {
            "risk_score": round(risk_score, 1),
            "risk_level": self._get_risk_level(risk_score),
            "breaches": breaches,
            "social_exposures": social_exposures,
            "dark_web_mentions": dark_web_mentions,
            "recommendations": recommendations,
            "exposed_sites": self._get_exposed_sites(breaches, social_exposures)
        }
    
    def _get_risk_level(self, score):
        """Convert numeric score to risk level"""
        if score < 30:
            return "Low"
        elif score < 70:
            return "Medium"
        else:
            return "High"
    
    def _get_exposed_sites(self, breaches, social_exposures):
        """Get list of sites where user is exposed"""
        sites = []
        
        for breach in breaches:
            sites.append({
                "name": breach["site"],
                "type": "Data Breach",
                "risk": "High",
                "data_exposed": breach["data_types"]
            })
        
        for exposure in social_exposures:
            if exposure["risk_level"] in ["Medium", "High"]:
                sites.append({
                    "name": exposure["platform"],
                    "type": "Social Media",
                    "risk": exposure["risk_level"],
                    "data_exposed": exposure["issues"]
                })
        
        return sites
    
    def _generate_recommendations(self, risk_score, breaches, social_exposures, dark_web_mentions):
        """Generate AI-powered recommendations"""
        recommendations = []
        
        if breaches:
            recommendations.append({
                "priority": "High",
                "action": "Change passwords immediately",
                "description": f"Your credentials were found in {len(breaches)} data breaches. Change passwords for all affected accounts.",
                "impact": "Reduces risk by 20-30 points"
            })
        
        if any(exp["risk_level"] == "High" for exp in social_exposures):
            recommendations.append({
                "priority": "Medium", 
                "action": "Review social media privacy settings",
                "description": "Your social media profiles are exposing personal information publicly.",
                "impact": "Reduces risk by 10-15 points"
            })
        
        if dark_web_mentions:
            recommendations.append({
                "priority": "High",
                "action": "Enable two-factor authentication",
                "description": "Your credentials were found on the dark web. Secure all accounts with 2FA.",
                "impact": "Reduces risk by 15-20 points"
            })
        
        # Always include general recommendations
        recommendations.extend([
            {
                "priority": "Medium",
                "action": "Use a password manager",
                "description": "Generate and store unique passwords for all accounts.",
                "impact": "Reduces risk by 10-15 points"
            },
            {
                "priority": "Low",
                "action": "Regular security checkups",
                "description": "Monitor your digital footprint monthly for new exposures.",
                "impact": "Maintains low risk score"
            }
        ])
        
        return recommendations[:5]  # Return top 5 recommendations

# Initialize and train the model
if __name__ == "__main__":
    analyzer = DigitalRiskAnalyzer()
    analyzer.train_model()
    
    # Test the model
    test_result = analyzer.calculate_risk_score("test@example.com", "+1234567890")
    print(json.dumps(test_result, indent=2))
