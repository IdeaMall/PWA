import { AddressOutput } from '@ideamall/data-model';
import { observable } from 'mobx';
import { observer } from 'mobx-react';
import {
  Field,
  RestForm,
  ScrollList,
  ScrollListProps,
} from 'mobx-restful-table';
import { Button, Form, Modal } from 'react-bootstrap';

import { AddressModel } from '../../models/Address';
import { i18n } from '../../models/Translation';
import { AddressCard } from './Card';

const { t } = i18n;

export interface AddressListProps extends ScrollListProps<AddressOutput> {
  store: AddressModel;
  name: string;
  defaultValue?: number;
}

@observer
export class AddressList extends ScrollList<AddressListProps> {
  translator = i18n;
  store = this.props.store;

  @observable
  creating = false;

  constructor(props: AddressListProps) {
    super(props);

    this.boot();
  }

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
    const { fields, store, creating } = this;

    return (
      <Modal show={creating} onHide={() => (this.creating = false)}>
        <Modal.Header>
          <Modal.Title>
            {t('edit')}
            {t('address')}
          </Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <RestForm translator={i18n} fields={fields} store={store} />
        </Modal.Body>
      </Modal>
    );
  }

  renderList() {
    const { name, defaultValue } = this.props,
      { allItems } = this.store;

    return (
      <>
        <Button className="w-100" onClick={() => (this.creating = true)}>
          {t('create')}
        </Button>

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

        {this.renderEditor()}
      </>
    );
  }
}
