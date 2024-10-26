import { Role } from '@ideamall/data-service';
import { Icon } from 'idea-react';
import { observer } from 'mobx-react';
import { Component, PropsWithChildren } from 'react';
import { Container, Nav } from 'react-bootstrap';

import { t } from '../../models/Translation';
import userStore from '../../models/User';
import { MainNavigator } from '../Layout/MainNavigator';
import { PageHead } from '../Layout/PageHead';

const { location } = globalThis;

@observer
export class AdminFrame extends Component<PropsWithChildren> {
  get routes() {
    return [
      { path: '', icon: 'clipboard-data', title: t('dashboard') },
      {
        path: 'user',
        icon: 'people',
        title: t('users'),
        roles: [Role.Administrator],
      },
      { path: 'category', icon: 'tags', title: t('categories') },
      { path: 'goods', icon: 'cart', title: t('goods') },
    ];
  }

  routeOf(rawPath: string) {
    const path = ('/admin/' + rawPath).replace(/\/$/, '');
    const active = rawPath
      ? location?.pathname.startsWith(path)
      : location?.pathname === path;

    return { path, active };
  }

  render() {
    const { children } = this.props,
      { routes } = this,
      { session } = userStore;
    const { title } =
      routes.find(({ path }) => this.routeOf(path).active) || {};

    return (
      <>
        <PageHead title={`${title} - ${t('administrator')}`} />

        <MainNavigator fluid />

        <div className="d-flex">
          <div className="ps-2">
            <Nav
              className="flex-column position-sticky"
              style={{ top: '4rem' }}
            >
              {routes.map(({ path, icon, title, roles }) => {
                if (
                  roles &&
                  !session?.roles?.some(role => roles.includes(role))
                )
                  return;

                const route = this.routeOf(path);

                return (
                  <Nav.Link
                    key={route.path}
                    className={`text-nowrap rounded-3 ${
                      route.active ? 'bg-primary text-white' : ''
                    }`}
                    href={route.path}
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
      </>
    );
  }
}
