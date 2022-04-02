import Imap, { Config } from "imap";
import { simpleParser } from "mailparser";

export const generateConfig = (email: string, password: string): Config => {
  return {
    user: email,
    password: password,
    host: "imap.gmail.com",
    port: 993,
    tls: true,
    tlsOptions: {
      rejectUnauthorized: false,
    },
  };
};

export const getEmails = (imapConfig: Config, actions: any) => {
  try {
    const imap = new Imap(imapConfig);
    imap.once("ready", () => {
      imap.openBox("INBOX", false, () => {
        imap.search(["UNSEEN", ["SINCE", new Date()]], (err, results) => {
          if (err) throw new Error("nothing to fetch");
          try {
            const f = imap.fetch(results, { bodies: "" });

            f.on("message", (msg) => {
              msg.on("body", (stream) => {
                simpleParser(stream, async (err, parsed) => {
                  // const {from, subject, textAsHtml, text} = parsed;
                  console.log(parsed.from?.value);
                  /* Make API call to save the data
                   Save the retrieved data into a database.
                   E.t.c
                */
                  actions(parsed);
                });
              });
              msg.once("attributes", (attrs) => {
                const { uid } = attrs;
                imap.addFlags(uid, ["\\Seen"], () => {
                  // Mark the email as read after reading it
                  console.log("Marked as read!");
                });
              });
            });

            f.once("end", () => {
              console.log("Done fetching all messages!");
              imap.end();
            });
          } catch (error) {
            console.log("an error has occur line 55");
          }
        });
      });
    });

    imap.once("error", (err: any) => {
      console.log("cannot do anything 2");
    });

    imap.once("end", () => {
      console.log("Connection ended");
    });

    imap.connect();
  } catch (ex) {
    console.log("an error occurred");
  }
};
