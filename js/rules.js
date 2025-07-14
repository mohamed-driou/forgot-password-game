export const passwordRules = [
    {
        id: 1,
        text: "Your password must be at least 8 characters",
        difficulty: "easy",
        validator: (input) => input.length >= 8,
        timeLimit: 10,
        points: 10
    },
    {
        id: 2,
        text: "Your password must include at least one number",
        difficulty: "easy",
        validator: (input) => /\d/.test(input),
        timeLimit: 10,
        points: 10
    },
    {
        id: 3,
        text: "Your password must include at least one capital letter",
        difficulty: "easy",
        validator: (input) => /[A-Z]/.test(input),
        timeLimit: 10,
        points: 10
    },
    {
        id: 4,
        text: "Your password must include at least one special character",
        difficulty: "easy",
        validator: (input) => /[!@#$%^&*(),.?":{}|<>\s]/.test(input), // Now includes space
        timeLimit: 10,
        points: 10
    },
    {
        id: 5,
        text: "Your password must include at least one space",
        difficulty: "easy",
        validator: (input) => /\s/.test(input),
        timeLimit: 10,
        points: 10
    },
    // Add more rules here...
];

export function getRuleById(id) {
    return passwordRules.find(rule => rule.id === id);
}