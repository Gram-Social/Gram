import React from 'react';
import { Link, Redirect, Route, Switch } from 'react-router-dom';

import LandingGradient from 'soapbox/components/landing-gradient';
import SvgIcon from 'soapbox/components/ui/icon/svg-icon';
import BundleContainer from 'soapbox/features/ui/containers/bundle_container';
import { NotificationsContainer } from 'soapbox/features/ui/util/async-components';
import { useAppSelector, useSoapboxConfig } from 'soapbox/hooks';

import { Card, CardBody } from '../../components/ui';
import LoginPage from '../auth_login/components/login_page';
import PasswordReset from '../auth_login/components/password_reset';
import PasswordResetConfirm from '../auth_login/components/password_reset_confirm';
import RegistrationForm from '../auth_login/components/registration_form';
import ExternalLoginForm from '../external_login/components/external-login-form';
import RegisterInvite from '../register_invite';
import Verification from '../verification';
import EmailPassthru from '../verification/email_passthru';

const AuthLayout = () => {
  const { logo } = useSoapboxConfig();
  const siteTitle = useAppSelector(state => state.instance.title);

  return (
    <div>
      <LandingGradient />

      <main className='relative flex flex-col h-screen'>
        <header className='py-10 flex justify-center relative'>
          <Link to='/' className='cursor-pointer'>
            {logo ? (
              <img src={logo} alt={siteTitle} className='h-7' />
            ) : (
              <SvgIcon
                className='w-7 h-7 dark:text-white'
                alt={siteTitle}
                src={require('@tabler/icons/icons/home.svg')}
              />
            )}
          </Link>
        </header>

        <div className='flex flex-col justify-center items-center'>
          <div className='pb-10 sm:mx-auto w-full sm:max-w-lg md:max-w-2xl'>
            <Card variant='rounded' size='xl'>
              <CardBody>
                <Switch>
                  <Route exact path='/verify' component={Verification} />
                  <Route exact path='/verify/email/:token' component={EmailPassthru} />
                  <Route exact path='/login/external' component={ExternalLoginForm} />
                  <Route exact path='/login' component={LoginPage} />
                  <Route exact path='/signup' component={RegistrationForm} />
                  <Route exact path='/reset-password' component={PasswordReset} />
                  <Route exact path='/edit-password' component={PasswordResetConfirm} />
                  <Route path='/invite/:token' component={RegisterInvite} />

                  <Redirect from='/auth/password/new' to='/reset-password' />
                  <Redirect from='/auth/password/edit' to='/edit-password' />
                </Switch>
              </CardBody>
            </Card>
          </div>
        </div>

      </main>

      <BundleContainer fetchComponent={NotificationsContainer}>
        {(Component) => <Component />}
      </BundleContainer>
    </div>
  );
};

export default AuthLayout;
