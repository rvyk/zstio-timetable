type MessageType = "INFO" | "UPDATE" | "WARNING" | "ERROR" | "SILENT";
type MessageTypeDisplay = "POPUP" | "BANNER";

type TimeRange = {
  from: string;
  to: string;
};

type Message = {
  id?: string;
  message?: string;
  published: boolean;
  date: Date;
  type: MessageType;
  displayType: MessageTypeDisplay;
  toUrl?: string;
  redirectUrl?: string;
  displayTime?: TimeRange;
};
