import json
import re
from typing import Dict, List, Any, Tuple
from datetime import datetime, timedelta

class AIRecommendationEngine:
    """
    AI-powered recommendation system for digital footprint security
    Uses rule-based AI and pattern matching to generate personalized security recommendations
    """
    
    def __init__(self):
        # Knowledge base of security recommendations
        self.recommendation_templates = {
            'password_security': {
                'high_priority': [
                    "Change passwords immediately for all accounts associated with breached email addresses",
                    "Use a unique, strong password (12+ characters) for each account",
                    "Enable two-factor authentication (2FA) on all critical accounts",
                    "Consider using a reputable password manager like Bitwarden or 1Password"
                ],
                'medium_priority': [
                    "Review and update passwords that haven't been changed in over 6 months",
                    "Remove saved passwords from browsers and use a dedicated password manager",
                    "Set up security alerts for your most important accounts"
                ]
            },
            'social_media_privacy': {
                'high_priority': [
                    "Review privacy settings on all social media platforms immediately",
                    "Remove or restrict access to personal information visible to public",
                    "Disable location sharing and check-in features",
                    "Audit third-party apps connected to your social media accounts"
                ],
                'medium_priority': [
                    "Limit friend/follower lists to people you actually know",
                    "Turn off facial recognition features where available",
                    "Review and delete old posts that contain sensitive information"
                ]
            },
            'data_breach_response': {
                'immediate': [
                    "Monitor your credit reports for suspicious activity",
                    "Set up fraud alerts with credit bureaus",
                    "Check bank and credit card statements for unauthorized transactions",
                    "Consider freezing your credit if SSN was compromised"
                ],
                'ongoing': [
                    "Sign up for identity monitoring services",
                    "Regularly check HaveIBeenPwned for new breaches",
                    "Keep detailed records of breach notifications"
                ]
            },
            'general_security': {
                'essential': [
                    "Keep all software and operating systems updated",
                    "Use antivirus software and keep it current",
                    "Be cautious with public Wi-Fi networks",
                    "Regularly backup important data"
                ],
                'advanced': [
                    "Consider using a VPN for enhanced privacy",
                    "Enable automatic security updates where possible",
                    "Use encrypted messaging apps for sensitive communications"
                ]
            }
        }
        
        # Risk pattern matching rules
        self.risk_patterns = {
            'critical_breach_types': ['ssn', 'credit_card', 'bank_account', 'passport'],
            'sensitive_data_types': ['password', 'security_question', 'financial'],
            'high_risk_platforms': ['dating', 'financial', 'healthcare', 'government'],
            'privacy_red_flags': ['location_always_on', 'public_profile', 'contact_info_visible']
        }

    def analyze_user_risk_profile(self, breach_data: List[Dict], social_data: List[Dict], 
                                user_behavior: Dict = None) -> Dict[str, Any]:
        """Analyze user's complete risk profile for personalized recommendations"""
        
        risk_profile = {
            'breach_severity': self._assess_breach_severity(breach_data),
            'social_exposure': self._assess_social_exposure(social_data),
            'data_sensitivity': self._assess_data_sensitivity(breach_data),
            'behavioral_patterns': self._analyze_behavioral_patterns(user_behavior or {}),
            'urgency_level': 'low'
        }
        
        # Determine overall urgency
        if risk_profile['breach_severity'] >= 80 or any(
            breach.get('severity') == 'critical' for breach in breach_data
        ):
            risk_profile['urgency_level'] = 'critical'
        elif risk_profile['breach_severity'] >= 60 or risk_profile['social_exposure'] >= 70:
            risk_profile['urgency_level'] = 'high'
        elif risk_profile['breach_severity'] >= 40 or risk_profile['social_exposure'] >= 50:
            risk_profile['urgency_level'] = 'medium'
        
        return risk_profile

    def _assess_breach_severity(self, breach_data: List[Dict]) -> int:
        """Assess severity of data breaches"""
        if not breach_data:
            return 0
        
        severity_scores = {'low': 10, 'medium': 30, 'high': 60, 'critical': 90}
        max_severity = max(
            severity_scores.get(breach.get('severity', 'low'), 10) 
            for breach in breach_data
        )
        
        # Factor in number of breaches
        breach_count_multiplier = min(1.5, 1 + (len(breach_data) - 1) * 0.1)
        
        return min(100, int(max_severity * breach_count_multiplier))

    def _assess_social_exposure(self, social_data: List[Dict]) -> int:
        """Assess social media exposure risk"""
        if not social_data:
            return 0
        
        exposure_scores = {'low': 15, 'medium': 40, 'high': 75}
        total_score = sum(
            exposure_scores.get(exposure.get('risk_level', 'low'), 15)
            for exposure in social_data
        )
        
        return min(100, total_score)

    def _assess_data_sensitivity(self, breach_data: List[Dict]) -> Dict[str, bool]:
        """Assess what types of sensitive data were compromised"""
        compromised_types = set()
        for breach in breach_data:
            compromised_types.update(breach.get('data_types', []))
        
        return {
            'financial_data': any(dt in compromised_types for dt in ['credit_card', 'bank_account', 'ssn']),
            'authentication_data': any(dt in compromised_types for dt in ['password', 'security_question']),
            'personal_identifiers': any(dt in compromised_types for dt in ['ssn', 'passport', 'drivers_license']),
            'contact_information': any(dt in compromised_types for dt in ['email', 'phone', 'address'])
        }

    def _analyze_behavioral_patterns(self, user_behavior: Dict) -> Dict[str, Any]:
        """Analyze user behavior patterns for targeted recommendations"""
        return {
            'password_reuse_likely': user_behavior.get('multiple_breaches_same_email', False),
            'social_media_active': user_behavior.get('social_platforms_count', 0) > 3,
            'security_conscious': user_behavior.get('has_2fa_enabled', False),
            'tech_savvy': user_behavior.get('uses_password_manager', False)
        }

    def generate_personalized_recommendations(self, risk_profile: Dict, 
                                           breach_data: List[Dict], 
                                           social_data: List[Dict]) -> Dict[str, Any]:
        """Generate AI-powered personalized security recommendations"""
        
        recommendations = {
            'immediate_actions': [],
            'short_term_goals': [],
            'long_term_improvements': [],
            'educational_resources': [],
            'priority_score': 0
        }
        
        urgency = risk_profile['urgency_level']
        data_sensitivity = risk_profile['data_sensitivity']
        behavioral = risk_profile['behavioral_patterns']
        
        # Immediate actions based on urgency
        if urgency in ['critical', 'high']:
            if data_sensitivity.get('financial_data'):
                recommendations['immediate_actions'].extend([
                    "🚨 URGENT: Monitor all bank and credit card accounts for unauthorized transactions",
                    "🚨 Contact your bank immediately to report potential compromise",
                    "🚨 Place fraud alerts on your credit reports with all three bureaus"
                ])
            
            if data_sensitivity.get('authentication_data'):
                recommendations['immediate_actions'].extend([
                    "🔐 Change passwords on ALL accounts immediately, starting with financial and email",
                    "🔐 Enable two-factor authentication on every account that supports it"
                ])
        
        # Password security recommendations
        if not behavioral.get('security_conscious'):
            if behavioral.get('password_reuse_likely'):
                recommendations['short_term_goals'].extend([
                    "Install and set up a password manager (recommended: Bitwarden, 1Password)",
                    "Generate unique passwords for each of your accounts",
                    "Update your most important accounts first: email, banking, work"
                ])
            else:
                recommendations['short_term_goals'].append(
                    "Consider using a password manager for better security"
                )
        
        # Social media privacy
        if risk_profile['social_exposure'] > 50:
            social_recommendations = self._generate_social_media_recommendations(social_data)
            recommendations['short_term_goals'].extend(social_recommendations)
        
        # Long-term security improvements
        recommendations['long_term_improvements'] = [
            "Set up regular security audits (quarterly review of accounts and passwords)",
            "Enable security notifications on all important accounts",
            "Consider using a VPN for enhanced privacy protection",
            "Regularly monitor your credit reports and identity theft protection services"
        ]
        
        # Educational resources based on user's tech level
        if not behavioral.get('tech_savvy'):
            recommendations['educational_resources'] = [
                "Learn about phishing attacks and how to identify them",
                "Understand the basics of two-factor authentication",
                "Read about safe browsing practices and public Wi-Fi risks"
            ]
        else:
            recommendations['educational_resources'] = [
                "Advanced privacy tools and techniques",
                "Understanding data breach notifications and response",
                "Corporate security best practices for remote work"
            ]
        
        # Calculate priority score
        recommendations['priority_score'] = self._calculate_priority_score(risk_profile)
        
        return recommendations

    def _generate_social_media_recommendations(self, social_data: List[Dict]) -> List[str]:
        """Generate specific social media privacy recommendations"""
        recommendations = []
        platforms = set(exposure.get('platform', '').lower() for exposure in social_data)
        
        platform_specific = {
            'facebook': "Review Facebook privacy settings: limit post visibility, disable facial recognition, check app permissions",
            'instagram': "Make Instagram account private, disable location services, review story settings",
            'twitter': "Protect your Twitter account, review who can find you by email/phone, limit photo tagging",
            'linkedin': "Adjust LinkedIn visibility settings, limit profile information to connections only",
            'tiktok': "Set TikTok account to private, disable location sharing, review data download settings"
        }
        
        for platform in platforms:
            if platform in platform_specific:
                recommendations.append(platform_specific[platform])
        
        # General social media recommendations
        recommendations.extend([
            "Audit and remove third-party apps connected to your social accounts",
            "Review and delete old posts containing personal information",
            "Turn off location sharing across all social media platforms"
        ])
        
        return recommendations

    def _calculate_priority_score(self, risk_profile: Dict) -> int:
        """Calculate priority score for recommendations (0-100)"""
        score = 0
        
        # Base score from urgency
        urgency_scores = {'low': 20, 'medium': 50, 'high': 75, 'critical': 95}
        score += urgency_scores.get(risk_profile['urgency_level'], 20)
        
        # Adjust based on data sensitivity
        if risk_profile['data_sensitivity'].get('financial_data'):
            score += 20
        if risk_profile['data_sensitivity'].get('personal_identifiers'):
            score += 15
        
        # Adjust based on user behavior
        if not risk_profile['behavioral_patterns'].get('security_conscious'):
            score += 10
        
        return min(100, score)

    def generate_educational_content(self, risk_profile: Dict) -> Dict[str, Any]:
        """Generate educational content based on user's risk profile"""
        
        content = {
            'articles': [],
            'videos': [],
            'tools': [],
            'quick_tips': []
        }
        
        urgency = risk_profile['urgency_level']
        
        if urgency in ['critical', 'high']:
            content['articles'] = [
                "What to Do When Your Data Has Been Breached: A Step-by-Step Guide",
                "Understanding Credit Monitoring and Identity Theft Protection",
                "How to Secure Your Accounts After a Data Breach"
            ]
            content['quick_tips'] = [
                "Change passwords starting with your most important accounts",
                "Enable 2FA wherever possible - it blocks 99.9% of automated attacks",
                "Monitor your accounts daily for the next 30 days"
            ]
        
        content['tools'] = [
            "HaveIBeenPwned - Check for future breaches",
            "Password Manager Comparison Guide",
            "Two-Factor Authentication Setup Guides"
        ]
        
        return content

# Example usage and testing
if __name__ == "__main__":
    engine = AIRecommendationEngine()
    
    # Sample data
    sample_breaches = [
        {
            'breach_name': 'LinkedIn',
            'severity': 'high',
            'data_types': ['email', 'password', 'name'],
            'breach_date': datetime(2021, 6, 1).date()
        }
    ]
    
    sample_social = [
        {
            'platform': 'Facebook',
            'exposure_type': 'public_profile',
            'risk_level': 'high'
        }
    ]
    
    # Generate recommendations
    risk_profile = engine.analyze_user_risk_profile(sample_breaches, sample_social)
    recommendations = engine.generate_personalized_recommendations(risk_profile, sample_breaches, sample_social)
    
    print(json.dumps(recommendations, indent=2, default=str))
