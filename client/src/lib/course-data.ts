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
    image: hoistImage,
    category: "Basic",
    safetyNotes: [
      "Ensure load is clear of obstructions before hoisting.",
      "Watch for drag on the load if not centered.",
      "Keep movements smooth to prevent swinging."
    ],
    mistakes: [
      "Making circles too large (can be confused with other signals).",
      "Not pointing finger clearly upward.",
      "Moving the whole arm instead of just the hand."
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
    image: lowerImage,
    category: "Basic",
    safetyNotes: [
      "Control the descent speed carefully.",
      "Ensure landing area is clear and stable.",
      "Don't lower too fast to avoid shock loading when stopping."
    ],
    mistakes: [
      "Pointing finger sideways.",
      "Moving arm too aggressively.",
      "Not watching the load landing point."
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
    image: stopImage,
    category: "Basic",
    safetyNotes: [
      "Use this signal immediately if you see any potential hazard.",
      "The operator must obey a stop signal from ANYONE on the site.",
      "Hold the signal until the operator acknowledges and stops."
    ],
    mistakes: [
      "Waving hand too fast (might look like emergency stop, though the result is similar).",
      "Not extending arm fully.",
      "Giving the signal tentatively."
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
    image: emergencyStopImage,
    category: "Emergency",
    safetyNotes: [
      "Used for imminent danger.",
      "Operator will slam on brakes/stop hydraulics immediately.",
      "Expect sudden load movement due to abrupt stop."
    ],
    mistakes: [
      "Using only one arm (looks like normal Stop).",
      "Not making the motion vigorous enough."
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
    image: swingImage,
    category: "Basic",
    safetyNotes: [
      "Watch for tail swing clearance.",
      "Ensure the boom path is clear of power lines and structures.",
      "Account for load drift during swing."
    ],
    mistakes: [
      "Pointing vaguely.",
      "Not checking the blind side of the swing.",
      "Standing in the swing path."
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
    image: raiseBoomImage,
    category: "Boom",
    safetyNotes: [
      "Raising the boom decreases the radius and increases capacity.",
      "Watch for two-blocking (load hitting boom tip).",
      "Load will move toward the crane unless Hoist Lower is also signaled."
    ],
    mistakes: [
      "Confusing with Hoist (Raise Load). Remember: Thumbs for Boom, Fingers for Load.",
      "Not watching the load height."
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
    image: lowerBoomImage,
    category: "Boom",
    safetyNotes: [
      "Lowering boom increases radius and decreases capacity.",
      "Watch for stability issues at long radii.",
      "Load will move away from crane and lower."
    ],
    mistakes: [
      "Confusing with Lower Load.",
      "Lowering too far beyond the capacity chart limits."
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
    image: travelImage,
    category: "Travel",
    safetyNotes: [
      "Ensure travel path is stable and level.",
      "Watch for overhead obstructions.",
      "Keep personnel clear of wheels/tracks."
    ],
    mistakes: [
      "Not indicating direction clearly.",
      "Signaling travel while load is high in the air (unsafe)."
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
