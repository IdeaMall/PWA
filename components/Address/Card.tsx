import { AddressOutput } from '@ideamall/data-model';
import { FC } from 'react';
import { Card, CardProps } from 'react-bootstrap';

export const Address: FC<
  Pick<
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
  >
> = ({
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
  <address>
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

export type AddressCardProps = AddressOutput & Pick<CardProps, 'as'>;

export const AddressCard: FC<AddressCardProps> = ({
  as,
  signature,
  mobilePhone,
  zipCode,
  ...address
}) => (
  <Card as={as}>
    <Card.Body>
      <Card.Title>{signature}</Card.Title>

      <Card.Text as="a" href={`tel:${mobilePhone}`}>
        {mobilePhone}
      </Card.Text>

      <Address {...address} />
    </Card.Body>
  </Card>
);
