export interface SendEmailDto {
  from: {
    name: string;
    address: string;
  };
  to: [
    {
      address: string;
    }
  ];

  subject: string;
  html: string;
  sendAt: string;
}
