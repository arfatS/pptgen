import React from "react";

import {
  Renewals,
  Letters,
  Users,
  Modules,
  Reporting,
  Docs
} from "assets/icons";

export const toolOptionsList = [
  {
    name: "Renewal Generator",
    value: "renewal",
    default: true
  },
  {
    name: "PPT Generator",
    value: "presentation",
    default: true
  },
  {
    name: "Mktg Mat Generator",
    value: "placemat"
  }
];

export const menuOptions = {
  presentation: [
    {
      name: "Presentation Dashboard",
      value: "presentation",
      icon: <Docs />,
      link: "/presentation/list",
      accessTo: ["PG-Users"]
    }
  ],
  renewal: [
    {
      name: "Rates Dashboard",
      value: "rates",
      icon: <Docs />,
      link: "/renewal/rates",
      accessTo: ["Underwriter", "Admin"],
      helperText: "(Upload Rates)"
    },
    {
      name: "Renewals Dashboard",
      value: "renewals",
      icon: <Docs />,
      link: "/renewal/renewals",
      accessTo: ["Sales", "Admin"],
      helperText: "(Build Renewals)"
    },
    {
      name: "Users",
      value: "users",
      icon: <Users />,
      link: "/renewal/admin/users",
      accessTo: ["Admin"]
    },
    {
      name: "Reporting",
      value: "reporting",
      icon: <Reporting />,
      link: "/renewal/admin/reports",
      accessTo: ["Admin"]
    },
    {
      name: "Letters",
      value: "letters",
      icon: <Letters />,
      link: "/renewal/admin/letters",
      accessTo: ["Admin"]
    },
    {
      name: "Topics",
      value: "topics",
      icon: <Modules />,
      link: "/renewal/admin/topics",
      accessTo: ["Admin"]
    },
    {
      name: "All Renewals and Rates",
      value: "all",
      icon: <Renewals />,
      link: "/renewal/admin",
      accessTo: ["Admin"]
    }
  ],
  placemat: [
    {
      name: "default",
      value: "default",
      icon: "",
      link: "#FIXME"
    }
  ]
};
