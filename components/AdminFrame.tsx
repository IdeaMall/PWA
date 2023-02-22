import { Role } from '@ideamall/data-model';
import { Icon } from 'idea-react';
import { PureComponent } from 'react';
import { Container, Nav } from 'react-bootstrap';

import { MainNavigator } from './MainNavigator';
import { SessionBox } from './SessionBox';

export class AdminFrame extends PureComponent {
  routes = [
    { path: '', icon: 'clipboard-data', title: '数据仪表盘' },
    { path: 'user', icon: 'people', title: '用户管理' },
  ];

  render() {
    const { children } = this.props;

    return (
      <SessionBox autoCover roles={[Role.Administrator]}>
        <MainNavigator />

        <div className="d-flex">
          <div className="ps-2">
            <Nav
              className="flex-column position-sticky"
              style={{ top: '4rem' }}
            >
              {this.routes.map(({ path, icon, title }) => {
                path = ('/admin/' + path).replace(/\/$/, '');

                const active = globalThis.location?.pathname === path;

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
