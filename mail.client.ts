import { SendEmailCommand, SESv2Client } from "@aws-sdk/client-sesv2";
import logger from "../logging/logger";

class EmailClient {
    private readonly client: SESv2Client;

    constructor() {
        this.client = new SESv2Client({ region: "us-east-1" });
    }

    public async send(testContent: string, htmlContent: string, subject: string, to: string, from: string): Promise<void> {
        logger.debug(`sending email to ${to}`);

        const html: string = "<html>"
            + "<head></head>"
            + "<body>"
            + `<p>${htmlContent}</p>`
            + "</body>"
            + "</html>";;
        logger.debug(html);
        const sendEmailCommand: SendEmailCommand = new SendEmailCommand({
            Content: {
                Simple: {
                    Body: {
                        Text: {
                            Data: testContent,
                        },
                        Html: {
                            Data: html,
                        }
                    },
                    Subject: {
                        Data: subject
                    }
                },
            },
            Destination: {
                ToAddresses: [to]
            },
            FromEmailAddress: from
        });

        await this.client.send(sendEmailCommand);
    }
}

const createClient = (): EmailClient => {
    return new EmailClient();
}

const emailClient: EmailClient = createClient();

export default emailClient;

