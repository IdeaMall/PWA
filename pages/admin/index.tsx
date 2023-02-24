import { StatisticSummary } from '@ideamall/data-model';
import { observer } from 'mobx-react';
import { PureComponent } from 'react';
import { Card, Col, Row } from 'react-bootstrap';

import { AdminFrame } from '../../components/AdminFrame';
import statisticStore from '../../models/Statistic';
import { i18n } from '../../models/Translation';

export default function AdminHomePage() {
  return (
    <AdminFrame>
      <AdminHome />
    </AdminFrame>
  );
}

const { t } = i18n;

@observer
class AdminHome extends PureComponent {
  componentDidMount() {
    statisticStore.getSummary();
  }

  render() {
    const { summary } = statisticStore;

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
