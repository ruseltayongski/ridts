import {
    mdiAccountCircle,
    mdiMonitor,
    mdiGithub,
    mdiLock,
    mdiAlertCircle,
    mdiSquareEditOutline,
    mdiTable,
    mdiViewList,
    mdiTelevisionGuide,
    mdiResponsive,
    mdiPalette,
    mdiReact,
    mdiViewDashboard,
    mdiAmbulance,
    mdiFolderArrowUp,
    mdiFolderArrowDown,
    mdiMessageProcessing,
    mdiHandHeartOutline,
    mdiFileDocumentMultiple,
    mdiBed,
    mdiAccountMultiple,
    mdiNeedle,
    mdiTableArrowDown,
    mdiCalendarRemoveOutline
  } from "@mdi/js";
  
  export default [
    {
      to: "/dashboard",
      icon: mdiViewDashboard,
      label: "Dashboard",
    },
    {
      to: "/clients",
      label: "Clients",
      icon: mdiAccountMultiple,
    },
    {
      to: "/vaccinated",
      label: "Vaccinated",
      icon: mdiNeedle,
    },
    {
      to: "/date_due",
      label: "Date Due",
      icon: mdiTableArrowDown,
    },
    {
      to: "/missed",
      label: "Missed",
      icon: mdiCalendarRemoveOutline,
    },
    {
      to: "/archived",
      label: "Archived",
      icon: mdiFileDocumentMultiple,
    },
    // {
    //   to: "/referred",
    //   label: "Referred",
    //   icon: mdiAmbulance,
    // },
    // {
    //   to: "/accepted",
    //   label: "Accepted",
    //   icon: mdiHandHeartOutline,
    // },
    // {
    //   to: "/incoming",
    //   label: "Incoming",
    //   icon: mdiBed,
    // },
    {
      to: "/text_blast",
      label: "Text Blast",
      icon: mdiMessageProcessing,
    }
  ];
  