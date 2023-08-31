import { GoodsStyle } from '@ideamall/data-model';
import { computed, makeObservable, observable } from 'mobx';
import { observer } from 'mobx-react';
import { observePropsState } from 'mobx-react-helper';
import { BadgeInput } from 'mobx-restful-table';
import { Component, MouseEvent } from 'react';
import { Button, Col, Form, Row } from 'react-bootstrap';

import { i18n } from '../../models/Translation';

const { t } = i18n;

export interface GoodsStyleEditorProps {
  defaultValue?: GoodsStyle[];
  value?: GoodsStyle[];
  onChange?: (value: GoodsStyle[]) => any;
}

@observer
@observePropsState
export class GoodsStyleEditor extends Component<GoodsStyleEditorProps> {
  constructor(props: GoodsStyleEditorProps) {
    super(props);
    makeObservable(this);
  }

  declare observedProps: GoodsStyleEditorProps;

  @observable
  innerValue = this.props.defaultValue || [];

  @computed
  get value() {
    return this.observedProps.value || this.innerValue;
  }

  @computed
  get controlled() {
    return Array.isArray(this.observedProps.value);
  }

  handleCreate = (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();

    this.innerValue = [...this.innerValue, { name: '', values: [] }];

    this.props.onChange?.(this.innerValue);
  };

  handleDelete = (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();

    const { index } = event.currentTarget.dataset,
      { innerValue } = this;

    this.innerValue = [
      ...innerValue.slice(0, +index!),
      ...innerValue.slice(+index! + 1),
    ];
    this.props.onChange?.(this.innerValue);
  };

  renderStyle = ({ name, values }: GoodsStyle, index: number) => (
    <Row
      as="fieldset"
      className="g-3 align-items-center"
      name="styles"
      key={name + index}
    >
      <Col xs={12} sm={4}>
        <Form.Control
          className="p-2"
          placeholder={t('name')}
          name="name"
          required
          {...(this.controlled ? { value: name } : { defaultValue: name })}
        />
      </Col>
      <Col xs={12} sm={6}>
        <BadgeInput
          name="values"
          {...(this.controlled ? { value: values } : { defaultValue: values })}
        />
      </Col>
      <Col xs={12} sm={2}>
        <Button
          className="w-100"
          variant="danger"
          data-index={index}
          onClick={this.handleDelete}
        >
          {t('delete')}
        </Button>
      </Col>
    </Row>
  );

  render() {
    const { value } = this;

    return (
      <Form.Group className="d-flex flex-column gap-3">
        <Form.Label className="m-0">{t('styles')}</Form.Label>

        {value.map(this.renderStyle)}

        <Button className="w-100" onClick={this.handleCreate}>
          {t('create')}
        </Button>
      </Form.Group>
    );
  }
}
