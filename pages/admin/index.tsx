import { observer } from 'mobx-react';
import { PureComponent } from 'react';
import { Card, Col, Row } from 'react-bootstrap';

import { AdminFrame } from '../../components/AdminFrame';
import { PageHead } from '../../components/PageHead';
import statisticStore from '../../models/Statistic';

export default function AdminHomePage() {
  return (
    <AdminFrame>
      <PageHead title="Admin Dashboard" />
      <AdminHome />
    </AdminFrame>
  );
}

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
              <Card.Header>{key}</Card.Header>
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
