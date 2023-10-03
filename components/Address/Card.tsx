import { Address } from '@ideamall/data-service';
import { FC, PropsWithChildren } from 'react';
import { Card, CardProps } from 'react-bootstrap';

export interface AddressProps
  extends Pick<
    Address,
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

export const AddressText: FC<AddressProps> = ({
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
  Address & Pick<CardProps, 'as'>
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
        <AddressText {...address} />
        {children}
      </div>
    </Card.Body>
  </Card>
);
