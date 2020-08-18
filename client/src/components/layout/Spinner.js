// Does the loading of the GIF
import React, { Fragment } from 'react';
import spinner from './spinner.gif';

export default () => (
  <Fragment>
    <h4 align='center'>Loading....</h4> <br></br>
    <img
      src={spinner}
      style={{
        width: '75px',
        margin: 'auto',
        display: 'block',
        paddingRight: '20px',
      }}
      alt='loading....'
    />
  </Fragment>
);
