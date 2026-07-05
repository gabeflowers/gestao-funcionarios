CREATE TABLE employees (
  id          SERIAL PRIMARY KEY,
  cpf         VARCHAR(11) UNIQUE NOT NULL,
  name        VARCHAR(120) NOT NULL,
  email       VARCHAR(150) UNIQUE NOT NULL,
  shirt_size  VARCHAR(2) NOT NULL CHECK (shirt_size IN ('PP','P','M','G','GG','XG')),
  shoe_size   SMALLINT NOT NULL CHECK (shoe_size BETWEEN 34 AND 48),
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);