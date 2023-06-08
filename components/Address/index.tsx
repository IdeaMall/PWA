import { AddressOutput } from '@ideamall/data-model';
import { observable } from 'mobx';
import { observer } from 'mobx-react';
import {
  Field,
  RestForm,
  ScrollList,
  ScrollListProps,
} from 'mobx-restful-table';
import { PureComponent } from 'react';
import { Button, Form, Modal } from 'react-bootstrap';

import { i18n } from '../../models/Translation';
import { AddressCard } from './Card';

const { t } = i18n;

export interface AddressListProps
  extends Omit<ScrollListProps<AddressOutput>, 'translator' | 'renderList'> {
  name: string;
  defaultValue?: number;
}

@observer
export class AddressList extends PureComponent<AddressListProps> {
  @observable
  creating = false;

  get fields(): Field<AddressOutput>[] {
    return [
      { key: 'signature' },
      { key: 'mobilePhone', type: 'tel' },
      // { key: 'zipCode' },
      { key: 'country' },
      { key: 'province' },
      { key: 'city' },
      { key: 'district' },
      { key: 'road' },
      { key: 'building' },
      { key: 'number' },
      { key: 'floor' },
      { key: 'room' },
    ];
  }

  renderEditor() {
    const { props, fields, creating } = this;

    return (
      <Modal show={creating} onHide={() => (this.creating = false)}>
        <Modal.Header>
          <Modal.Title>
            {t('edit')}
            {t('address')}
          </Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <RestForm translator={i18n} fields={fields} store={props.store} />
        </Modal.Body>
      </Modal>
    );
  }

  render() {
    const { store, name, defaultValue } = this.props;

    return (
      <>
        <Button className="w-100" onClick={() => (this.creating = true)}>
          {t('create')}
        </Button>

        <ScrollList
          translator={i18n}
          store={store}
          renderList={allItems => (
            <ul className="list-unstyled my-3">
              {allItems.map(item => (
                <AddressCard as="li" key={item.id} {...item}>
                  <Form.Check
                    type="radio"
                    name={name}
                    value={item.id}
                    defaultChecked={item.id === defaultValue}
                  />
                </AddressCard>
              ))}
            </ul>
          )}
        />
        {this.renderEditor()}
      </>
    );
  }
}
