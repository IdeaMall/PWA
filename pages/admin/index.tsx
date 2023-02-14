import { observer } from 'mobx-react';
import { PureComponent } from 'react';
import { Card, Col, Row } from 'react-bootstrap';

import { MainNavigator } from '../../components/MainNavigator';
import { SessionBox } from '../../components/SessionBox';
import statisticStore from '../../models/Statistic';

@observer
export default class AdminHomePage extends PureComponent {
  componentDidMount() {
    statisticStore.getSummary();
  }

  render() {
    const { summary } = statisticStore;

    return (
      <SessionBox autoCover>
        <MainNavigator />

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
      </SessionBox>
    );
  }
}
