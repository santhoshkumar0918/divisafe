; Divorce Support MeTTa Knowledge Base
; Comprehensive emotional support system with cultural sensitivity

; Emotional State Recognition with Crisis Detection
(= (emotional-state angry divorce)
   (response "I sense you're feeling angry about your divorce. This is completely normal. Would you like to talk about what's making you feel this way?")
   (room-suggestion "anger-management" "legal-consultation")
   (intensity high)
   (crisis-level low))

(= (emotional-state sad separation)
   (response "I understand you're feeling sad about the separation. Grief is a natural part of this process. You're not alone in this.")
   (room-suggestion "post-divorce-recovery" "emotional-support")
   (intensity medium)
   (crisis-level low))

(= (emotional-state anxious custody)
   (response "Custody anxiety is very common. Let's explore some coping strategies and connect you with others who understand.")
   (room-suggestion "co-parenting-support" "legal-advice")
   (intensity high)
   (crisis-level medium))

(= (emotional-state hopeless depression)
   (response "I'm concerned about how you're feeling. You matter, and there are people who want to help.")
   (crisis-alert high)
   (escalate-to professional-counselor)
   (intensity high)
   (crisis-level high))

; Crisis Detection Patterns
(= (crisis-pattern suicidal-ideation)
   (keywords "end it all" "better off dead" "no point living" "kill myself" "suicide" "not worth living")
   (alert-level emergency)
   (action immediate-intervention)
   (response "I'm very concerned about you. Please reach out to emergency services or a crisis helpline immediately. You are not alone.")
   (crisis-level emergency))

(= (crisis-pattern self-harm)
   (keywords "hurt myself" "cutting" "pills" "bridge" "overdose" "end my life")
   (alert-level high)
   (action crisis-counselor)
   (response "I hear how much pain you're in. Please know that there are people who care and want to help you through this.")
   (crisis-level high))

; Indian Cultural Context
(= (cultural-context indian joint-family)
   (considerations "family-honor" "social-stigma" "arranged-marriage-dissolution" "extended-family-pressure")
   (response "I understand the additional pressure from family expectations. Your wellbeing matters most.")
   (room-suggestion "cultural-support" "family-mediation")
   (crisis-level medium))

(= (cultural-context indian dowry-issues)
   (legal-aspect harassment domestic-violence maintenance child-custody)
   (response "These are serious legal matters. Let me connect you with legal support.")
   (room-suggestion "legal-consultation" "womens-support")
   (crisis-level high))

(= (cultural-context indian social-stigma)
   (considerations "community-judgment" "family-reputation" "remarriage-challenges")
   (response "The social stigma can feel overwhelming, but you're taking a brave step for your wellbeing.")
   (room-suggestion "post-divorce-recovery" "new-beginnings")
   (crisis-level medium))

; Room Matching Logic
(= (room-match financial-stress)
   (primary-rooms "financial-recovery" "legal-consultation")
   (secondary-rooms "general-support" "success-stories")
   (crisis-level low))

(= (room-match child-custody)
   (primary-rooms "co-parenting-support" "legal-advice")
   (secondary-rooms "mens-support" "womens-support")
   (crisis-level medium))

(= (room-match emotional-trauma)
   (primary-rooms "therapy-sessions" "emotional-support")
   (secondary-rooms "self-care-sanctuary" "personal-transformation")
   (crisis-level medium))

(= (room-match legal-issues)
   (primary-rooms "legal-consultation" "financial-recovery")
   (secondary-rooms "general-support")
   (crisis-level low))

; Therapeutic Approaches
(= (therapeutic-approach cognitive-behavioral)
   (technique "thought-challenging" "behavioral-activation" "problem-solving")
   (response-style "questioning" "solution-focused")
   (suitable-for anger anxiety depression))

(= (therapeutic-approach supportive)
   (technique "active-listening" "validation" "normalization" "empathy")
   (response-style "empathetic" "reassuring" "understanding")
   (suitable-for grief trauma relationship-loss sadness))

(= (therapeutic-approach crisis-intervention)
   (technique "safety-planning" "immediate-support" "resource-connection")
   (response-style "calming" "directive" "urgent")
   (suitable-for suicidal-ideation self-harm severe-depression))

; Emotional Intensity Assessment
(= (intensity-level low)
   (indicators "mild" "slight" "minimal" "occasional")
   (response-style gentle supportive))

(= (intensity-level medium)
   (indicators "moderate" "noticeable" "discomforting" "regular")
   (response-style understanding validating))

(= (intensity-level high)
   (indicators "intense" "overwhelming" "constant" "severe")
   (response-style concerned empathetic))

; Resource Recommendations
(= (resource-recommendation anger-management)
   (resources
     (article "Managing Anger During Divorce" "https://www.helpguide.org/articles/relationships-communication/anger-management.htm")
     (audio "Anger Management Meditation" "https://www.mindful.org/mindfulness-meditation-anger/")
     (book "The Dance of Anger" "Harriet Lerner")))

(= (resource-recommendation grief-support)
   (resources
     (article "Grieving Your Marriage" "https://www.divorcemag.com/articles/grieving-your-marriage")
     (video "Finding Hope After Divorce" "https://www.youtube.com/watch?v=example")
     (support-group "DivorceCare" "https://www.divorcecare.org/")))

(= (resource-recommendation crisis-support)
   (resources
     (hotline "National Suicide Prevention Lifeline" "988" "24/7")
     (hotline "Crisis Text Line" "741741" "24/7")
     (emergency "Emergency Services" "911" "24/7")))

; Follow-up Question Generation
(= (follow-up-questions anger)
   (questions
     "What aspect of the divorce process is making you feel most angry?"
     "Have you been able to talk to anyone about these feelings?"
     "What would help you feel more in control right now?"))

(= (follow-up-questions sadness)
   (questions
     "What do you miss most about your relationship?"
     "What would help you feel supported right now?"
     "What small step could you take toward healing?"))

(= (follow-up-questions anxiety)
   (questions
     "What specific aspects of the future worry you most?"
     "What would make you feel more secure during this transition?"
     "Who in your support network can you reach out to?"))

; Cultural Sensitivity Rules
(= (cultural-response indian-context)
   (adjustments
     (increase-privacy-concerns true)
     (add-family-considerations true)
     (suggest-community-resources true)
     (emphasize-stigma-reduction true)))

(= (cultural-response western-context)
   (adjustments
     (focus-individual-autonomy true)
     (suggest-professional-therapy true)
     (provide-legal-resources true)))

; Progress Assessment
(= (recovery-stage early)
   (indicators "intense-emotions" "daily-crying" "sleep-issues" "appetite-changes")
   (focus-areas "crisis-management" "basic-self-care" "social-support"))

(= (recovery-stage middle)
   (indicators "decreasing-intensity" "hope-emerging" "new-routines" "social-connection")
   (focus-areas "skill-building" "relationship-exploration" "life-planning"))

(= (recovery-stage late)
   (indicators "emotional-stability" "future-orientation" "new-relationships" "life-satisfaction")
   (focus-areas "growth-activities" "giving-back" "new-beginnings"))
