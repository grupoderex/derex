export interface SNSResponse {
  data: SNS[];
  message: string;
}

export interface SNS {
  id: number;
  name: string;
  icon: string;
  link: string;
  created_at: string;
  updated_at: string;
}
