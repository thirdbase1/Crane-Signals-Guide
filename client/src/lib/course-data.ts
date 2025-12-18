import heroImage from "@assets/generated_images/mobile_crane_at_construction_site_sunrise.png";
import hoistImage from "@assets/generated_images/vector_illustration_of_hoist_hand_signal.png";
import lowerImage from "@assets/generated_images/vector_illustration_of_lower_hand_signal.png";
import stopImage from "@assets/generated_images/vector_illustration_of_stop_hand_signal.png";
import emergencyStopImage from "@assets/generated_images/vector_illustration_of_emergency_stop_signal.png";
import swingImage from "@assets/generated_images/vector_illustration_of_swing_hand_signal.png";
import raiseBoomImage from "@assets/generated_images/vector_illustration_of_raise_boom_hand_signal.png";
import lowerBoomImage from "@assets/generated_images/vector_illustration_of_lower_boom_hand_signal.png";
import travelImage from "@assets/generated_images/vector_illustration_of_travel_hand_signal.png";
import useMainHoistImage from "@assets/generated_images/vector_illustration_of_use_main_hoist_signal.png";
import useWhiplineImage from "@assets/generated_images/vector_illustration_of_use_whipline_signal.png";
import moveSlowlyImage from "@assets/generated_images/vector_illustration_of_move_slowly_signal.png";
import dogEverythingImage from "@assets/generated_images/vector_illustration_of_dog_everything_signal.png";
import extendBoomImage from "@assets/generated_images/vector_illustration_of_extend_boom_signal.png";
import retractBoomImage from "@assets/generated_images/vector_illustration_of_retract_boom_signal.png";
import extendBoomOneHandImage from "@assets/generated_images/vector_illustration_of_extend_boom_one_hand_signal.png";
import retractBoomOneHandImage from "@assets/generated_images/vector_illustration_of_retract_boom_one_hand_signal.png";
import raiseBoomLowerLoadImage from "@assets/generated_images/vector_illustration_of_raise_boom_lower_load_signal.png";
import lowerBoomRaiseLoadImage from "@assets/generated_images/vector_illustration_of_lower_boom_raise_load_signal.png";

export interface Signal {
  id: string;
  name: string;
  description: string;
  explanation: string;
  detailedExplanation: string;
  image: string;
  category: "Basic" | "Boom" | "Travel" | "Emergency" | "Hoist Control" | "Advanced";
  safetyNotes: string[];
  mistakes: string[];
  quiz: {
    question: string;
    options: string[];
    correctAnswer: number;
  };
}

export const signals: Signal[] = [
  {
    id: "hoist",
    name: "Hoist",
    description: "Raise the load vertically.",
    explanation: "With forearm vertical and forefinger pointing up, move hand in small horizontal circle.",
    detailedExplanation: "The 'Hoist' signal tells the crane operator to lift the load upwards using the main or auxiliary hoist line. The signaler stands with their forearm perfectly vertical, extending their index finger upward towards the sky. The hand is then rotated in small, controlled horizontal circles. The speed of the circle often indicates the desired speed of the hoist - slow circles for slow movement, faster circles for faster movement.",
    image: hoistImage,
    category: "Basic",
    safetyNotes: [
      "Ensure load is clear of obstructions before hoisting.",
      "Watch for drag on the load if not centered.",
      "Keep movements smooth to prevent swinging.",
      "Verify the rigging is secure as tension is applied."
    ],
    mistakes: [
      "Making circles too large (can be confused with other signals).",
      "Not pointing finger clearly upward.",
      "Moving the whole arm instead of just the hand.",
      "Signaling hoist before the hook is centered over the load."
    ],
    quiz: {
      question: "What is the correct hand motion for 'Hoist'?",
      options: [
        "Forefinger down, small circles",
        "Forefinger up, small horizontal circles",
        "Thumb up, arm extended",
        "Palm open, pushing motion"
      ],
      correctAnswer: 1
    }
  },
  {
    id: "lower",
    name: "Lower",
    description: "Lower the load vertically.",
    explanation: "With arm extended downward, forefinger pointing down, move hand in small horizontal circle.",
    detailedExplanation: "The 'Lower' signal instructs the operator to release the hoist line to bring the load down. The signaler extends their arm downward at an angle, pointing their index finger towards the ground. The hand is then rotated in small horizontal circles. It is the direct opposite of the hoist signal. Clear visibility of the landing area is crucial before giving this signal.",
    image: lowerImage,
    category: "Basic",
    safetyNotes: [
      "Control the descent speed carefully.",
      "Ensure landing area is clear and stable.",
      "Don't lower too fast to avoid shock loading when stopping.",
      "Check for personnel underneath the load path."
    ],
    mistakes: [
      "Pointing finger sideways.",
      "Moving arm too aggressively.",
      "Not watching the load landing point.",
      "Confusing 'Lower Load' with 'Lower Boom' (thumbs vs fingers)."
    ],
    quiz: {
      question: "Which direction should your finger point for the 'Lower' signal?",
      options: [
        "Upward",
        "Downward",
        "Towards the crane",
        "Away from the crane"
      ],
      correctAnswer: 1
    }
  },
  {
    id: "use-main-hoist",
    name: "Use Main Hoist",
    description: "Designate use of main hoist line.",
    explanation: "Hand pointing to the side with index finger extended horizontally.",
    detailedExplanation: "The 'Use Main Hoist' signal tells the operator to use the primary hoist mechanism rather than the auxiliary or whipline. This is used when a crane has multiple hoist systems. The signaler points horizontally with one finger extended to clearly designate which hoist system to engage.",
    image: useMainHoistImage,
    category: "Hoist Control",
    safetyNotes: [
      "Clearly indicate which hoist system is needed.",
      "Operator must confirm understanding before proceeding.",
      "Ensure the correct hook is available and rigged.",
      "Know the capacity differences between hoist systems."
    ],
    mistakes: [
      "Giving this signal without establishing clear visual communication first.",
      "Pointing ambiguously.",
      "Not confirming the operator acknowledged the command."
    ],
    quiz: {
      question: "What does the 'Use Main Hoist' signal designate?",
      options: [
        "Lower the boom",
        "The primary hoist mechanism to use",
        "Travel direction",
        "Emergency procedures"
      ],
      correctAnswer: 1
    }
  },
  {
    id: "use-whipline",
    name: "Use Whipline",
    description: "Designate use of auxiliary hoist (whipline).",
    explanation: "Hand pointing upward with multiple fingers extended.",
    detailedExplanation: "The 'Use Whipline' signal (also called auxiliary hoist or secondary hoist) tells the operator to use an alternate hoisting mechanism. This is typically used for lighter loads or when the main hoist is unavailable. The signaler points upward with multiple fingers to indicate the auxiliary system.",
    image: useWhiplineImage,
    category: "Hoist Control",
    safetyNotes: [
      "Whipline has different capacity - verify load is within limits.",
      "Slower hoist speed than main hoist.",
      "Use only for loads within auxiliary capacity rating."
    ],
    mistakes: [
      "Using whipline for loads exceeding its rating.",
      "Not communicating clearly which hoist line to use.",
      "Confusing main hoist and whipline signals."
    ],
    quiz: {
      question: "The whipline is also known as:",
      options: [
        "Main hoist",
        "Auxiliary or secondary hoist",
        "Emergency hoist",
        "Backup crane"
      ],
      correctAnswer: 1
    }
  },
  {
    id: "move-slowly",
    name: "Move Slowly",
    description: "Reduce speed of operation.",
    explanation: "Hand raised with palm forward, making slow deliberate movements.",
    detailedExplanation: "The 'Move Slowly' signal tells the operator to reduce the speed of current operations. This can apply to hoist, swing, travel, or boom movements. The signaler raises their hand with palm forward and makes controlled, deliberate motions. This signal is critical when precision is required or when working near obstacles or personnel.",
    image: moveSlowlyImage,
    category: "Basic",
    safetyNotes: [
      "Use when approaching final load position.",
      "Essential when working near structures or power lines.",
      "Maintain clear visibility as speed reduces.",
      "Be prepared to give STOP signal if needed."
    ],
    mistakes: [
      "Giving signal too late when already moving fast.",
      "Not being clear about which operation to slow down.",
      "Failing to follow up with STOP if things go wrong."
    ],
    quiz: {
      question: "When should you signal 'Move Slowly'?",
      options: [
        "Only for loads over 50 tons",
        "When approaching final load position or obstacles",
        "Only during emergencies",
        "Every 10 minutes during operations"
      ],
      correctAnswer: 1
    }
  },
  {
    id: "stop",
    name: "Stop",
    description: "Stop all crane motion.",
    explanation: "Arm extended, palm down, move arm back and forth horizontally.",
    detailedExplanation: "The 'Stop' signal is a command to cease all current crane functions immediately but normally. The signaler extends one arm horizontally with the palm facing down and moves the arm back and forth in a horizontal sweeping motion. This is used for normal pauses in operation or when a minor adjustment is needed.",
    image: stopImage,
    category: "Basic",
    safetyNotes: [
      "Use this signal immediately if you see any potential hazard.",
      "The operator must obey a stop signal from ANYONE on the site.",
      "Hold the signal until the operator acknowledges and stops.",
      "Do not resume signaling until the operator is ready."
    ],
    mistakes: [
      "Waving hand too fast (might look like emergency stop).",
      "Not extending arm fully.",
      "Giving the signal tentatively.",
      "Signaling stop too late when approaching an obstacle."
    ],
    quiz: {
      question: "Who can give the 'Stop' signal on a jobsite?",
      options: [
        "Only the designated signalperson",
        "Only the supervisor",
        "Anyone who sees a hazard",
        "Only the crane operator"
      ],
      correctAnswer: 2
    }
  },
  {
    id: "emergency-stop",
    name: "Emergency Stop",
    description: "Immediate stop of all operations.",
    explanation: "Both arms extended, palms down, move arms back and forth horizontally.",
    detailedExplanation: "The 'Emergency Stop' is critical for preventing imminent accidents. It signals the operator to halt all functions instantly, often engaging brakes abruptly. The signaler extends BOTH arms horizontally with palms down and swings them back and forth vigorously. This indicates a serious and immediate danger requiring an instant freeze of the machine.",
    image: emergencyStopImage,
    category: "Emergency",
    safetyNotes: [
      "Used for imminent danger only.",
      "Operator will slam on brakes/stop hydraulics immediately.",
      "Expect sudden load movement due to abrupt stop (swinging).",
      "Everyone clear the area immediately after this signal."
    ],
    mistakes: [
      "Using only one arm (looks like normal Stop).",
      "Not making the motion vigorous enough.",
      "Using it for non-emergency pauses (causes unnecessary stress on equipment)."
    ],
    quiz: {
      question: "How does 'Emergency Stop' differ from normal 'Stop'?",
      options: [
        "It uses a red flag",
        "It uses both arms instead of one",
        "It involves shouting",
        "It uses a whistle"
      ],
      correctAnswer: 1
    }
  },
  {
    id: "dog-everything",
    name: "Dog Everything",
    description: "Secure all movable parts - lock everything down.",
    explanation: "Both hands making securing/locking motions in front of chest.",
    detailedExplanation: "The 'Dog Everything' signal tells the operator to engage all mechanical locks, latches, and brakes to secure the crane in a stationary position. This includes boom locks, hook blocks, hydraulic brakes, and any movable components. The signaler makes deliberate locking/securing motions with both hands to emphasize the security requirement.",
    image: dogEverythingImage,
    category: "Basic",
    safetyNotes: [
      "Use at end of workday before crane is left unattended.",
      "Critical for weather events or emergency situations.",
      "Verify all dogs/locks are fully engaged visually.",
      "No personnel should work near a 'dogged' crane."
    ],
    mistakes: [
      "Not verifying all locks engaged.",
      "Assuming boom is locked when it's not.",
      "Leaving equipment unattended without dogging everything."
    ],
    quiz: {
      question: "What does 'Dog Everything' mean?",
      options: [
        "Lower the boom slowly",
        "Use the auxiliary hoist",
        "Lock and secure all movable parts",
        "Swing the boom 360 degrees"
      ],
      correctAnswer: 2
    }
  },
  {
    id: "swing",
    name: "Swing",
    description: "Rotate the boom/cab.",
    explanation: "Arm extended, point with finger in direction of swing of boom.",
    detailedExplanation: "The 'Swing' signal directs the operator to rotate the crane's upper structure (superstructure) left or right. The signaler extends their arm horizontally and points their index finger in the direction the boom should swing. This controls the lateral movement of the load across the site.",
    image: swingImage,
    category: "Basic",
    safetyNotes: [
      "Watch for tail swing clearance (counterweight hitting obstacles).",
      "Ensure the boom path is clear of power lines and structures.",
      "Account for load drift (centrifugal force) during swing.",
      "Keep swing speeds slow and controlled."
    ],
    mistakes: [
      "Pointing vaguely.",
      "Not checking the blind side of the swing.",
      "Standing in the swing path.",
      "Signaling swing before the load is hoisted high enough to clear obstacles."
    ],
    quiz: {
      question: "When signaling 'Swing', what does your finger indicate?",
      options: [
        "The speed of the swing",
        "The direction of the boom swing",
        "The location of the load",
        "The operator's position"
      ],
      correctAnswer: 1
    }
  },
  {
    id: "raise-boom",
    name: "Raise Boom",
    description: "Angle the boom upwards.",
    explanation: "Arm extended, fingers closed, thumb pointing upward.",
    detailedExplanation: "The 'Raise Boom' signal tells the operator to boom up (luff up). The signaler extends their arm horizontally with a closed fist and the thumb pointing straight up. This action raises the angle of the boom. Note: Raising the boom brings the load closer to the crane (decreases radius) and typically raises the load height unless the operator lowers the hoist line simultaneously.",
    image: raiseBoomImage,
    category: "Boom",
    safetyNotes: [
      "Raising the boom decreases the radius and increases capacity.",
      "Watch for two-blocking (load block hitting boom tip).",
      "Load will move toward the crane unless Hoist Lower is also signaled.",
      "Ensure boom stops are functioning."
    ],
    mistakes: [
      "Confusing with Hoist (Raise Load). Remember: Thumbs for Boom, Fingers for Load.",
      "Not watching the load height increasing as boom rises.",
      "Not accounting for the load moving horizontally towards the crane."
    ],
    quiz: {
      question: "What part of the hand is used to signal boom movements?",
      options: [
        "Index finger",
        "Open palm",
        "Thumb",
        "Fist"
      ],
      correctAnswer: 2
    }
  },
  {
    id: "lower-boom",
    name: "Lower Boom",
    description: "Angle the boom downwards.",
    explanation: "Arm extended, fingers closed, thumb pointing downward.",
    detailedExplanation: "The 'Lower Boom' signal instructs the operator to boom down. The signaler extends their arm horizontally with a closed fist and the thumb pointing straight down. This lowers the boom angle, which moves the load further away from the crane (increases radius) and lowers the load height.",
    image: lowerBoomImage,
    category: "Boom",
    safetyNotes: [
      "Lowering boom increases radius and decreases lifting capacity.",
      "Watch for stability issues at long radii (tipping hazard).",
      "Load will move away from crane and lower simultaneously.",
      "Do not lower boom beyond the load chart limits."
    ],
    mistakes: [
      "Confusing with Lower Load.",
      "Lowering too far beyond the capacity chart limits.",
      "Not watching for obstacles as the load moves outward."
    ],
    quiz: {
      question: "What happens to the load radius when you 'Lower Boom'?",
      options: [
        "Radius decreases",
        "Radius increases",
        "Radius stays the same",
        "Load goes up"
      ],
      correctAnswer: 1
    }
  },
  {
    id: "extend-boom",
    name: "Extend Boom",
    description: "Extend telescoping boom sections.",
    explanation: "Both arms extended forward horizontally, palms down, moving outward.",
    detailedExplanation: "The 'Extend Boom' signal tells the operator to telescope the boom outward to increase its length. This is used on telescoping cranes to increase the working radius. The signaler extends both arms forward with palms down and moves them outward in a spreading motion to indicate extension.",
    image: extendBoomImage,
    category: "Advanced",
    safetyNotes: [
      "Only used on telescoping booms.",
      "Do not extend boom while load is suspended.",
      "Extending boom changes center of gravity - may require repositioning.",
      "Listen for hydraulic pressure changes."
    ],
    mistakes: [
      "Using on non-telescoping booms.",
      "Extending with load suspended.",
      "Not checking stability after extension."
    ],
    quiz: {
      question: "What type of crane uses the 'Extend Boom' signal?",
      options: [
        "Fixed boom cranes",
        "Telescoping boom cranes",
        "Only derricks",
        "Overhead cranes"
      ],
      correctAnswer: 1
    }
  },
  {
    id: "retract-boom",
    name: "Retract Boom",
    description: "Retract telescoping boom sections.",
    explanation: "Both arms extended forward horizontally, palms down, moving inward.",
    detailedExplanation: "The 'Retract Boom' signal tells the operator to telescope the boom inward to shorten its length. This is the opposite of extend boom and is used when reducing the working radius. The signaler extends both arms forward with palms down and moves them inward toward the body in a closing motion.",
    image: retractBoomImage,
    category: "Advanced",
    safetyNotes: [
      "Only used on telescoping booms.",
      "Do not retract boom while load is suspended.",
      "Retracting boom may require repositioning to maintain load angle.",
      "Allow for smooth hydraulic operation."
    ],
    mistakes: [
      "Retracting with load suspended.",
      "Not watching for boom section alignment.",
      "Retracting too quickly."
    ],
    quiz: {
      question: "What is the opposite movement of 'Extend Boom'?",
      options: [
        "Raise Boom",
        "Lower Boom",
        "Retract Boom",
        "Swing"
      ],
      correctAnswer: 2
    }
  },
  {
    id: "extend-boom-one-hand",
    name: "Extend Boom (One Hand)",
    description: "Extend one side of boom or single operation.",
    explanation: "One arm extended forward horizontally, palm down, moving outward.",
    detailedExplanation: "The 'Extend Boom (One Hand)' signal is used to extend one section of a multi-part telescoping boom or to control single-side extension on asymmetrical boom systems. The signaler uses one arm extended forward with palm down, moving outward to indicate which side or section to extend.",
    image: extendBoomOneHandImage,
    category: "Advanced",
    safetyNotes: [
      "Clearly indicate which boom section to extend.",
      "Ensure balanced extension to maintain stability.",
      "Used only on specific multi-section boom cranes."
    ],
    mistakes: [
      "Using when full extend boom is needed.",
      "Not indicating which section clearly.",
      "Creating unbalanced loads."
    ],
    quiz: {
      question: "When is 'Extend Boom (One Hand)' used?",
      options: [
        "Always instead of two-handed extend",
        "For single-section or one-side boom extension",
        "For emergency situations only",
        "When wind speed is high"
      ],
      correctAnswer: 1
    }
  },
  {
    id: "retract-boom-one-hand",
    name: "Retract Boom (One Hand)",
    description: "Retract one side of boom or single operation.",
    explanation: "One arm extended forward horizontally, palm down, moving inward.",
    detailedExplanation: "The 'Retract Boom (One Hand)' signal tells the operator to retract one section of a multi-part telescoping boom. The signaler uses one arm extended forward with palm down, moving inward toward the body to indicate which side or section to retract.",
    image: retractBoomOneHandImage,
    category: "Advanced",
    safetyNotes: [
      "Maintain balance during single-side retraction.",
      "Verify all sections align properly.",
      "Do not retract while load is suspended."
    ],
    mistakes: [
      "Creating unbalanced boom sections.",
      "Retracting wrong section.",
      "Rapid uncontrolled retraction."
    ],
    quiz: {
      question: "The opposite of 'Retract Boom (One Hand)' is:",
      options: [
        "Hoist",
        "Swing",
        "Extend Boom (One Hand)",
        "Travel"
      ],
      correctAnswer: 2
    }
  },
  {
    id: "raise-boom-lower-load",
    name: "Raise Boom, Lower Load",
    description: "Simultaneously raise boom angle while lowering the load.",
    explanation: "Both hands used simultaneously - one hand with thumb pointing up, other with forefinger pointing down in small circles.",
    detailedExplanation: "The 'Raise Boom, Lower Load' signal tells the operator to perform two actions at the same time: boom up and hoist down. This combined signal is used to reposition loads efficiently. The signaler uses both hands - one showing the raise boom thumbs-up signal while the other shows the lower load with fingers pointing down in circles. This avoids the need to stop and start multiple times.",
    image: raiseBoomLowerLoadImage,
    category: "Advanced",
    safetyNotes: [
      "Operator must understand combined signal clearly.",
      "Load will move toward crane and downward simultaneously.",
      "Watch load position throughout the combined movement.",
      "Ensure boom path is clear of obstacles."
    ],
    mistakes: [
      "Using unclear hand positions.",
      "Not establishing clear hand communication before signaling.",
      "Using combined signals without operator confirmation."
    ],
    quiz: {
      question: "What two movements occur with 'Raise Boom, Lower Load'?",
      options: [
        "Boom down and load up",
        "Boom up and load down",
        "Swing and hoist",
        "Travel and swing"
      ],
      correctAnswer: 1
    }
  },
  {
    id: "lower-boom-raise-load",
    name: "Lower Boom, Raise Load",
    description: "Simultaneously lower boom angle while raising the load.",
    explanation: "Both hands used simultaneously - one hand with thumb pointing down, other with forefinger pointing up in small circles.",
    detailedExplanation: "The 'Lower Boom, Raise Load' signal instructs the operator to perform two concurrent actions: boom down and hoist up. This is the opposite of the raise boom/lower load signal. The signaler uses both hands - one showing the lower boom thumbs-down signal while the other shows the hoist with fingers pointing up in circles.",
    image: lowerBoomRaiseLoadImage,
    category: "Advanced",
    safetyNotes: [
      "Load will move away from crane and upward simultaneously.",
      "Verify boom doesn't swing before executing.",
      "Watch for load swinging from combined movements.",
      "Ensure adequate clearance above the load path."
    ],
    mistakes: [
      "Confusing this with raise boom/lower load.",
      "Using wrong hand signals.",
      "Not verifying operator understands before signaling."
    ],
    quiz: {
      question: "What is the opposite of 'Raise Boom, Lower Load'?",
      options: [
        "Stop",
        "Travel",
        "Lower Boom, Raise Load",
        "Emergency Stop"
      ],
      correctAnswer: 2
    }
  },
  {
    id: "travel",
    name: "Travel",
    description: "Move the mobile crane.",
    explanation: "Arm extended forward, hand open and raised, making a pushing motion in direction of travel.",
    detailedExplanation: "The 'Travel' signal tells the operator to move the entire crane on its tracks or wheels. The signaler faces the crane, extends their arm forward with an open palm raised, and makes a pushing motion in the direction the crane needs to travel. Both hands can be used to indicate travel with both tracks.",
    image: travelImage,
    category: "Travel",
    safetyNotes: [
      "Ensure travel path is stable, level, and capable of supporting the crane weight.",
      "Watch for overhead obstructions (power lines, bridges).",
      "Keep personnel clear of wheels/tracks and blind spots.",
      "Use a spotter for blind moves."
    ],
    mistakes: [
      "Not indicating direction clearly.",
      "Signaling travel while load is high in the air (unsafe).",
      "Traveling too fast for ground conditions."
    ],
    quiz: {
      question: "Which signal involves a 'pushing' motion?",
      options: [
        "Hoist",
        "Swing",
        "Travel",
        "Stop"
      ],
      correctAnswer: 2
    }
  }
];

export const courseInfo = {
  title: "Mobile Crane Hand Signals Course",
  heroImage: heroImage,
  description: "Master the essential language of crane safety. A comprehensive, free online guide for construction professionals and beginners.",
};
