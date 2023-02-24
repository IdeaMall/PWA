import { Role } from '@ideamall/data-model';
import { Icon } from 'idea-react';
import { observer } from 'mobx-react';
import { PureComponent } from 'react';
import { Container, Nav } from 'react-bootstrap';

import { i18n } from '../models/Translation';
import { MainNavigator } from './MainNavigator';
import { PageHead } from './PageHead';
import { SessionBox } from './SessionBox';

const { t } = i18n;

@observer
export class AdminFrame extends PureComponent {
  get routes() {
    return [
      { path: '', icon: 'clipboard-data', title: t('dashboard') },
      { path: 'user', icon: 'people', title: t('users') },
      { path: 'category', icon: 'tags', title: t('categories') },
    ];
  }

  routeOf(path: string) {
    path = ('/admin/' + path).replace(/\/$/, '');

    const active = globalThis.location?.pathname === path;

    return { path, active };
  }

  render() {
    const { children } = this.props,
      { routes } = this;
    const { title } =
      routes.find(({ path }) => this.routeOf(path).active) || {};

    return (
      <SessionBox autoCover roles={[Role.Administrator]}>
        <PageHead title={`${title} - ${t('administrator')}`} />

        <MainNavigator />

        <div className="d-flex">
          <div className="ps-2">
            <Nav
              className="flex-column position-sticky"
              style={{ top: '4rem' }}
            >
              {routes.map(({ path, icon, title }) => {
                var { path, active } = this.routeOf(path);

                return (
                  <Nav.Link
                    className={`text-nowrap rounded-3 ${
                      active ? 'bg-primary text-white' : ''
                    }`}
                    href={path}
                    key={path}
                  >
                    <Icon className="me-3" name={icon} />
                    <span className="d-none d-sm-inline">{title}</span>
                  </Nav.Link>
                );
              })}
            </Nav>
          </div>
          <Container as="main" className="py-2" fluid>
            {children}
          </Container>
        </div>
      </SessionBox>
    );
  }
}
