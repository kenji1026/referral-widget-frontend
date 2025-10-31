export type DialogPage =
  | "auth"
  | "reward"
  | "share"
  | "dashboard"
  | "activity-logs";

export interface Activity {
  type: string;
  amount: string;
  product: string;
  date: string;
}
