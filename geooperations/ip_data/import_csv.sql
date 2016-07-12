create table mapping(ipNumberFrom bigint, ipNumberTo bigint, country_code varchar(2), country varchar(255), region varchar(255), city varchar(255));

\copy mapping from 'IP2LOCATION-LITE-DB3.CSV' with delimiter ',' null '' csv quote '"'
