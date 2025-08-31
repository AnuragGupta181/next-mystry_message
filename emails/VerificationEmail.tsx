import {
  Html,
  Head,
  Font,
  Preview,
  Heading,
  Row,
  Section,
  Text,
} from '@react-email/components';

interface VerificationEmailProps {
  username: string;
  otp: string;
}

export default function VerificationEmail({ username, otp }: VerificationEmailProps) {
  return (
    <Html lang="en" dir="ltr">
      <Head>
        <title>Verification Code</title>
        <Font
          fontFamily="Roboto"
          fallbackFontFamily="Verdana"
          webFont={{
            url: 'https://fonts.gstatic.com/s/roboto/v27/KFOmCnqEu92Fr1Mu4mxKKTU1Kg.woff2',
            format: 'woff2',
          }}
          fontWeight={400}
          fontStyle="normal"
        />
      </Head>

      <Preview>Your verification code: {otp}</Preview>

      <Section style={styles.container}>
        <Row>
          <Heading as="h2" style={styles.heading}>
            Hello {username},
          </Heading>
        </Row>

        <Row>
          <Text style={styles.text}>
            Thank you for registering! Use the code below to complete your registration:
          </Text>
        </Row>

        <Row>
          <Text style={styles.otp}>{otp}</Text>
        </Row>

        <Row>
          <Text style={styles.text}>
            If you didn’t request this code, please ignore this email.
          </Text>
        </Row>

        {/* Optional Button */}
        {/* <Row>
          <Button
            href={`http://localhost:3000/verify/${username}`}
            style={styles.button}
          >
            Verify Here
          </Button>
        </Row> */}
      </Section>
    </Html>
  );
}

const styles = {
  container: {
    backgroundColor: '#f9f9f9',
    padding: '40px',
    borderRadius: '8px',
    fontFamily: 'Roboto, Verdana, sans-serif',
    maxWidth: '600px',
    margin: 'auto',
  },
  heading: {
    fontSize: '24px',
    color: '#333',
    marginBottom: '20px',
  },
  text: {
    fontSize: '16px',
    color: '#555',
    lineHeight: '1.6',
    marginBottom: '20px',
  },
  otp: {
    fontSize: '32px',
    color: '#111',
    fontWeight: 'bold',
    letterSpacing: '4px',
    textAlign: 'center' as const,
    margin: '30px 0',
  },
  button: {
    backgroundColor: '#4f46e5',
    color: '#fff',
    padding: '12px 20px',
    fontSize: '16px',
    borderRadius: '6px',
    textDecoration: 'none',
  },
};
