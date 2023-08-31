import { AddressOutput } from '@ideamall/data-model';
import { FC, PropsWithChildren } from 'react';
import { Card, CardProps } from 'react-bootstrap';

export interface AddressProps
  extends Pick<
    AddressOutput,
    | 'country'
    | 'province'
    | 'city'
    | 'district'
    | 'road'
    | 'number'
    | 'building'
    | 'floor'
    | 'room'
  > {
  className?: string;
}

export const Address: FC<AddressProps> = ({
  className = 'm-0',
  country,
  province,
  city,
  district,
  road,
  number,
  building,
  floor,
  room,
}) => (
  <address className={className}>
    {country}
    {province}
    {city}
    {district}
    {road}
    {number}
    {building}
    {floor}
    {room}
  </address>
);

export type AddressCardProps = PropsWithChildren<
  AddressOutput & Pick<CardProps, 'as'>
>;

export const AddressCard: FC<AddressCardProps> = ({
  as,
  children,
  signature,
  mobilePhone,
  zipCode,
  ...address
}) => (
  <Card as={as}>
    <Card.Body>
      <Card.Title className="d-flex justify-content-between align-items-center">
        {signature}

        <a className="small" href={`tel:${mobilePhone}`}>
          {mobilePhone}
        </a>
      </Card.Title>
      <div className="d-flex justify-content-between align-items-center">
        <Address {...address} />
        {children}
      </div>
    </Card.Body>
  </Card>
);
