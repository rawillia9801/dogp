export type PlanKey = "starter" | "pro" | "elite";

export type Plan = {
  code: PlanKey;
  name: string;
  price: number;
  popular?: boolean;
  limits: {
    dogs: number | "Unlimited";
    litters: number | "Unlimited";
    users: number | "Unlimited";
  };
  highlights: string[];
};

export const plans: Plan[] = [
  {
    code: "starter",
    name: "Starter",
    price: 29,
    limits: {
      dogs: 20,
      litters: 3,
      users: 1,
    },
    highlights: [
      "Dashboard, dogs, litters, and puppies",
      "Breeding program workspace",
      "Admin settings",
    ],
  },
  {
    code: "pro",
    name: "Pro",
    price: 79,
    popular: true,
    limits: {
      dogs: 75,
      litters: 12,
      users: 4,
    },
    highlights: [
      "Everything in Starter",
      "Buyers, applications, and payments",
      "Documents and transportation",
    ],
  },
  {
    code: "elite",
    name: "Elite",
    price: 149,
    limits: {
      dogs: "Unlimited",
      litters: "Unlimited",
      users: "Unlimited",
    },
    highlights: [
      "Everything in Pro",
      "Automation notices",
      "Expanded limits",
      "Multi-user operations",
    ],
  },
];

export const comparisonRows = [
  ["Dogs limit", "20", "75", "Unlimited"],
  ["Litters limit", "3", "12", "Unlimited"],
  ["Users", "1", "4", "Unlimited"],
  ["Breeding workspace", "Included", "Included", "Included"],
  ["Buyer operations", "Included", "Included", "Included"],
  ["Automation notices", "Included", "Included", "Included"],
];
