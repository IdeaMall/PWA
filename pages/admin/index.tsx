import { Role, StatisticSummary } from '@ideamall/data-service';
import { observer } from 'mobx-react';
import dynamic from 'next/dynamic';
import { PureComponent } from 'react';
import { Card, Col, Row } from 'react-bootstrap';

import { AdminFrame } from '../../components/AdminFrame';
import { StatisticModel } from '../../models/Statistic';
import { i18n } from '../../models/Translation';

const SessionBox = dynamic(() => import('../../components/SessionBox'), {
  ssr: false,
});

export default function AdminHomePage() {
  return (
    <SessionBox autoCover roles={[Role.Administrator, Role.Manager]}>
      <AdminFrame>
        <AdminHome />
      </AdminFrame>
    </SessionBox>
  );
}

const { t } = i18n;

@observer
class AdminHome extends PureComponent {
  store = new StatisticModel();

  componentDidMount() {
    this.store.getSummary();
  }

  render() {
    const { summary } = this.store;

    return (
      <Row xs={1} sm={2} md={4} className="g-4 text-center">
        {Object.entries(summary).map(([key, count]) => (
          <Col key={key}>
            <Card>
              <Card.Header>{t(key as keyof StatisticSummary)}</Card.Header>
              <Card.Body>
                <Card.Text className="display-1">{count}</Card.Text>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    );
  }
}
