import heroImage from "@assets/generated_images/mobile_crane_at_construction_site_sunrise.png";
import hoistImage from "@assets/generated_images/vector_illustration_of_hoist_hand_signal.png";
import lowerImage from "@assets/generated_images/vector_illustration_of_lower_hand_signal.png";
import stopImage from "@assets/generated_images/vector_illustration_of_stop_hand_signal.png";
import emergencyStopImage from "@assets/generated_images/vector_illustration_of_emergency_stop_signal.png";
import swingImage from "@assets/generated_images/vector_illustration_of_swing_hand_signal.png";
import raiseBoomImage from "@assets/generated_images/vector_illustration_of_raise_boom_hand_signal.png";
import lowerBoomImage from "@assets/generated_images/vector_illustration_of_lower_boom_hand_signal.png";
import travelImage from "@assets/generated_images/vector_illustration_of_travel_hand_signal.png";

export interface Signal {
  id: string;
  name: string;
  description: string;
  explanation: string;
  detailedExplanation: string;
  image: string;
  category: "Basic" | "Boom" | "Travel" | "Emergency";
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
