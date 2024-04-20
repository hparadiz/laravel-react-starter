import { useEffect, useState } from 'react';
import { SessionData } from "../../Data/Interfaces/Session"
import { Button, Form, H4, Spinner, Input, SizableText, YStack } from 'tamagui';
import Http from '../../Data/Http';

interface FormProps {
  onLoginEvent: (updatedSession: SessionData) => void;
}

interface FormStructure {
  email: string;
  code: string;
  password: string;
  confirm: string;
}


function ErrorMessage(props) {
  if (!props.errorMessage) {
    return null;
  }

  return (
    <YStack space="$2" alignItems="center">
      <SizableText size="$3" theme="red_alt1">{props.errorMessage}</SizableText>
    </YStack>
  );
}


export function LoginForm({ onLoginEvent }: FormProps) {
  const [errorMessage,setErrorMessage] = useState<string>('');
  const [status, setStatus] = useState<'local' | 'awaitingXhr'>('local')
  const [formData, setFormData] = useState<FormStructure>({ email: '',code: '', password: '', confirm: ''});
  const [identificationState, setIdentificationState] = useState<'identityPrompt'|'passwordPrompt'|'verifyCodePrompt'|'registerPassword'|'tosPrompt'>('identityPrompt');

  var headerText, headerInUse;
  if (identificationState === 'identityPrompt') {
    headerText = 'Please login';
  }

  if (identificationState === 'verifyCodePrompt') {
    headerText = 'Please enter your code';
  }

  if (identificationState === 'registerPassword') {
    headerText = 'Please provide a password';
  }

  if (identificationState === 'passwordPrompt') {
    headerText = 'Please enter your password';
  }

  headerInUse = headerText;

  const handleChange = (name, value) => {
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  async function handleSubmit() {
    setStatus('awaitingXhr');
    
    headerInUse = 'Please wait';

    if (identificationState === 'identityPrompt') {
      await identify();
    }

    if (identificationState === 'verifyCodePrompt') {
      await verifyCode();
    }

    if (identificationState === 'registerPassword') {
      await registerPassword();
    }

    if (identificationState === 'passwordPrompt') {
      await verifyPasswordLogin();
    }

    headerInUse = headerText;
    
    setStatus('local');
  }

  // Step 1: person throws in an email. next step: password prompt or they are not registered: verify their email
  async function identify()
  {
    setErrorMessage('');
    var response = await (new Http()).post('auth/identify',{
      email: formData.email
    });
    if (response.success) {
      setIdentificationState(response.identificationState);
    } else {
      setErrorMessage(response.errors.concat("\n"));
    }
  }

  // verify access to their email
  async function verifyCode()
  {
    setErrorMessage('');
    var response = await (new Http()).post('auth/verify-identity',{
      email: formData.email,
      code: formData.code
    });
    if (response.success) {
      setIdentificationState(response.identificationState);
    } else {
      setErrorMessage(response.errors.concat("\n"));
    }
  }

  // register a password
  async function registerPassword()
  {
    setErrorMessage('');
    var response = await (new Http()).post('auth/register',{
      email: formData.email,
      code: formData.code,
      password: formData.password,
      confirm: formData.confirm
    });

    formData.password = '';
    formData.confirm = '';

    if (response.success) {
      onLoginEvent(response.session);
      setIdentificationState(response.identificationState);
    } else {
      setErrorMessage(response.errors.concat("\n"));
    }
  }

  // register a password
  async function verifyPasswordLogin()
  {
    setErrorMessage('');
    var response = await (new Http()).post('auth/verify-password',{
      email: formData.email,
      password: formData.password,
    });

    if (response.success) {
      formData.password = '';
      onLoginEvent(response.session);
      setIdentificationState(response.identificationState);
    } else {
      setErrorMessage(response.errors.concat("\n"));
    }
  }


  useEffect(() => {
    if (status === 'awaitingXhr') {
      const timer = setTimeout(() => setStatus('local'), 2000)
      return () => {
        clearTimeout(timer)
      }
    }
  }, [status])
  

  return (
    <Form
      alignItems="center"
      minWidth={300}
      gap="$2"
      onSubmit={handleSubmit}
      borderWidth={1}
      borderRadius="$4"
      backgroundColor="$background"
      borderColor="$borderColor"
      padding="$8"
    >
      <H4>{headerInUse}</H4>
      <ErrorMessage errorMessage={errorMessage}></ErrorMessage>
      {identificationState==='identityPrompt' ?
      <Input
        placeholder="Email"
        autoCapitalize="none"
        autoFocus
        borderWidth={2}
        color="$color"
        value={formData.email}
        onChangeText={(text) => handleChange('email', text)}
      /> : null
      }

      {identificationState==='passwordPrompt' ?
      <Input
        placeholder="Password"
        autoCapitalize="none"
        autoFocus
        borderWidth={2}
        color="$color"
        secureTextEntry={true}
        onChangeText={(text) => handleChange('password', text)}
      /> : null
      }

      {identificationState==='registerPassword' ?
      <Input
        placeholder="Password"
        autoCapitalize="none"
        borderWidth={2}
        color="$color"
        secureTextEntry={true}
        onChangeText={(text) => handleChange('password', text)}
      /> : null
      }

      {identificationState==='registerPassword' ?
      <Input
        placeholder="Confirm"
        autoCapitalize="none"
        borderWidth={2}
        color="$color"
        secureTextEntry={true}
        onChangeText={(text) => handleChange('confirm', text)}
      /> : null
      }

      {identificationState==='verifyCodePrompt' ?
      <Input
        placeholder="Code"
        autoCapitalize="none"
        borderWidth={2}
        color="$color"
        onChangeText={(text) => handleChange('code', text)}
      /> : null
      }

      <Form.Trigger asChild disabled={status !== 'local'}>
        <Button icon={status === 'awaitingXhr' ? () => <Spinner /> : undefined}>
          Login
        </Button>
      </Form.Trigger>
    </Form>
  )
}