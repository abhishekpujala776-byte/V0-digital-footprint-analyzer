import json
import re
from typing import Dict, List, Any
from datetime import datetime, timedelta

class RiskAssessmentEngine:
    """
    Digital Footprint Risk Assessment Engine
    Calculates risk scores based on breach data, social media exposure, and privacy settings
    """
    
    def __init__(self):
        # Risk scoring weights
        self.weights = {
            'breach_severity': {
                'critical': 40,
                'high': 25,
                'medium': 15,
                'low': 5
            },
            'data_types': {
                'password': 20,
                'ssn': 25,
                'credit_card': 30,
                'email': 5,
                'phone': 10,
                'address': 15,
                'name': 3
            },
            'social_exposure': {
                'public_profile': 10,
                'personal_info': 20,
                'location_data': 25,
                'financial_info': 35,
                'private_messages': 30
            },
            'recency_multiplier': {
                'days_30': 1.5,
                'days_90': 1.3,
                'days_365': 1.1,
                'older': 0.8
            }
        }
    
    def calculate_breach_risk(self, breaches: List[Dict]) -> Dict[str, Any]:
        """Calculate risk score from data breaches"""
        if not breaches:
            return {'score': 0, 'details': 'No breaches found'}
        
        total_score = 0
        breach_details = []
        
        for breach in breaches:
            breach_score = 0
            
            # Base severity score
            severity = breach.get('severity', 'low')
            breach_score += self.weights['breach_severity'].get(severity, 5)
            
            # Data types compromised
            data_types = breach.get('data_types', [])
            for data_type in data_types:
                breach_score += self.weights['data_types'].get(data_type, 2)
            
            # Recency factor
            breach_date = breach.get('breach_date')
            if breach_date:
                days_ago = (datetime.now().date() - breach_date).days
                if days_ago <= 30:
                    breach_score *= self.weights['recency_multiplier']['days_30']
                elif days_ago <= 90:
                    breach_score *= self.weights['recency_multiplier']['days_90']
                elif days_ago <= 365:
                    breach_score *= self.weights['recency_multiplier']['days_365']
                else:
                    breach_score *= self.weights['recency_multiplier']['older']
            
            total_score += breach_score
            breach_details.append({
                'name': breach.get('breach_name', 'Unknown'),
                'score': round(breach_score, 1),
                'severity': severity,
                'data_types': data_types
            })
        
        # Normalize to 0-100 scale
        normalized_score = min(100, total_score)
        
        return {
            'score': round(normalized_score, 1),
            'breach_count': len(breaches),
            'details': breach_details
        }
    
    def calculate_social_exposure_risk(self, exposures: List[Dict]) -> Dict[str, Any]:
        """Calculate risk score from social media exposure"""
        if not exposures:
            return {'score': 0, 'details': 'No social media exposure detected'}
        
        total_score = 0
        exposure_details = []
        
        for exposure in exposures:
            exposure_type = exposure.get('exposure_type', 'public_profile')
            risk_level = exposure.get('risk_level', 'low')
            
            # Base exposure score
            base_score = self.weights['social_exposure'].get(exposure_type, 10)
            
            # Risk level multiplier
            multipliers = {'low': 0.5, 'medium': 1.0, 'high': 1.8}
            exposure_score = base_score * multipliers.get(risk_level, 1.0)
            
            total_score += exposure_score
            exposure_details.append({
                'platform': exposure.get('platform', 'Unknown'),
                'type': exposure_type,
                'risk_level': risk_level,
                'score': round(exposure_score, 1)
            })
        
        # Normalize to 0-100 scale
        normalized_score = min(100, total_score * 0.8)  # Social media is weighted less than breaches
        
        return {
            'score': round(normalized_score, 1),
            'exposure_count': len(exposures),
            'details': exposure_details
        }
    
    def calculate_privacy_score(self, scan_data: Dict) -> Dict[str, Any]:
        """Calculate privacy score based on various factors"""
        privacy_factors = {
            'email_in_breaches': scan_data.get('breach_count', 0) > 0,
            'social_media_public': len(scan_data.get('social_exposures', [])) > 0,
            'recent_activity': scan_data.get('recent_breach_activity', False),
            'high_risk_exposures': any(
                exp.get('risk_level') == 'high' 
                for exp in scan_data.get('social_exposures', [])
            )
        }
        
        # Start with perfect privacy score
        privacy_score = 100
        
        # Deduct points for privacy issues
        if privacy_factors['email_in_breaches']:
            privacy_score -= 30
        if privacy_factors['social_media_public']:
            privacy_score -= 20
        if privacy_factors['recent_activity']:
            privacy_score -= 25
        if privacy_factors['high_risk_exposures']:
            privacy_score -= 15
        
        privacy_score = max(0, privacy_score)
        
        return {
            'score': privacy_score,
            'factors': privacy_factors,
            'recommendations': self._generate_privacy_recommendations(privacy_factors)
        }
    
    def _generate_privacy_recommendations(self, factors: Dict) -> List[str]:
        """Generate privacy improvement recommendations"""
        recommendations = []
        
        if factors['email_in_breaches']:
            recommendations.extend([
                "Change passwords for all accounts associated with compromised email",
                "Enable two-factor authentication on all important accounts",
                "Consider using a password manager for unique passwords"
            ])
        
        if factors['social_media_public']:
            recommendations.extend([
                "Review and tighten social media privacy settings",
                "Limit personal information visible to public",
                "Remove or restrict location sharing"
            ])
        
        if factors['recent_activity']:
            recommendations.extend([
                "Monitor accounts for suspicious activity",
                "Set up account alerts and notifications",
                "Consider credit monitoring services"
            ])
        
        if factors['high_risk_exposures']:
            recommendations.extend([
                "Remove sensitive personal information from public profiles",
                "Audit third-party app permissions",
                "Review data sharing settings across platforms"
            ])
        
        return recommendations
    
    def calculate_overall_risk(self, breach_data: List[Dict], social_exposures: List[Dict]) -> Dict[str, Any]:
        """Calculate comprehensive risk assessment"""
        
        # Calculate individual risk components
        breach_risk = self.calculate_breach_risk(breach_data)
        social_risk = self.calculate_social_exposure_risk(social_exposures)
        
        # Prepare scan data for privacy calculation
        scan_data = {
            'breach_count': breach_risk['breach_count'],
            'social_exposures': social_exposures,
            'recent_breach_activity': any(
                (datetime.now().date() - breach.get('breach_date', datetime.now().date())).days <= 90
                for breach in breach_data if breach.get('breach_date')
            )
        }
        
        privacy_assessment = self.calculate_privacy_score(scan_data)
        
        # Calculate weighted overall risk score
        # Breaches are weighted most heavily, then social exposure, then privacy factors
        overall_score = (
            breach_risk['score'] * 0.5 +
            social_risk['score'] * 0.3 +
            (100 - privacy_assessment['score']) * 0.2
        )
        
        # Determine risk level
        if overall_score >= 80:
            risk_level = 'critical'
        elif overall_score >= 60:
            risk_level = 'high'
        elif overall_score >= 40:
            risk_level = 'medium'
        else:
            risk_level = 'low'
        
        return {
            'overall_score': round(overall_score, 1),
            'risk_level': risk_level,
            'breach_risk': breach_risk,
            'social_risk': social_risk,
            'privacy_score': privacy_assessment['score'],
            'recommendations': privacy_assessment['recommendations'],
            'summary': self._generate_risk_summary(overall_score, risk_level, breach_risk, social_risk)
        }
    
    def _generate_risk_summary(self, score: float, level: str, breach_risk: Dict, social_risk: Dict) -> str:
        """Generate human-readable risk summary"""
        summaries = {
            'critical': f"Critical risk detected (Score: {score}/100). Immediate action required to secure your digital presence.",
            'high': f"High risk identified (Score: {score}/100). Several security vulnerabilities need attention.",
            'medium': f"Moderate risk level (Score: {score}/100). Some improvements recommended for better security.",
            'low': f"Low risk detected (Score: {score}/100). Your digital footprint appears relatively secure."
        }
        
        base_summary = summaries.get(level, f"Risk score: {score}/100")
        
        # Add specific details
        details = []
        if breach_risk['breach_count'] > 0:
            details.append(f"{breach_risk['breach_count']} data breach(es) found")
        if social_risk['exposure_count'] > 0:
            details.append(f"{social_risk['exposure_count']} social media exposure(s) detected")
        
        if details:
            base_summary += f" Key findings: {', '.join(details)}."
        
        return base_summary

# Example usage and testing
if __name__ == "__main__":
    engine = RiskAssessmentEngine()
    
    # Sample breach data
    sample_breaches = [
        {
            'breach_name': 'LinkedIn Data Breach',
            'breach_date': datetime(2021, 6, 1).date(),
            'data_types': ['email', 'password', 'name'],
            'severity': 'high'
        },
        {
            'breach_name': 'Facebook Leak',
            'breach_date': datetime(2023, 1, 15).date(),
            'data_types': ['email', 'phone', 'name'],
            'severity': 'medium'
        }
    ]
    
    # Sample social exposure data
    sample_exposures = [
        {
            'platform': 'Twitter',
            'exposure_type': 'public_profile',
            'risk_level': 'medium'
        },
        {
            'platform': 'Instagram',
            'exposure_type': 'location_data',
            'risk_level': 'high'
        }
    ]
    
    # Calculate risk assessment
    result = engine.calculate_overall_risk(sample_breaches, sample_exposures)
    print(json.dumps(result, indent=2, default=str))
