import {
  Avatar,
  Button,
  Container,
  Divider,
  IconButton,
  makeStyles,
  Typography,
} from '@material-ui/core';
import Link from 'next/link';
import SearchIcon from '@material-ui/icons/Search';
import React from 'react';

interface Props {
  children?: any;
}

const name = 'Online shop';
const useStyles = makeStyles({
  header: {
    padding: '5px 0',
  },
  content: {
    display: 'flex',
    justifyContent: 'space-between',
  },
  items: {
    display: 'flex',
    justifyContent: 'space-between',
  },
});

/**
 * Frontend header
 */
export default function Component(props: Props) {
  const classes = useStyles();
  const [categoriesOpen, setCategoriesOpen] = React.useState(false);
  const [searchOpen, setSearchOpen] = React.useState(false);

  /**
   * Open / Close categories modal on click
   */
  function handleCategoryBtnClick() {
    setCategoriesOpen(!categoriesOpen);
  }

  /**
   * Open / Close search modal on click
   */
  function handleSearchBtnClick() {
    setSearchOpen(!searchOpen);
  }
  return (
    <Container className={classes.header}>
      <div className={classes.content}>
        <div className={classes.items}>
          <Typography variant={'h4'}>{name}</Typography>
          <Divider orientation="vertical" />
          <Button onClick={handleCategoryBtnClick}>Categories</Button>
        </div>
        <div className={classes.items}>
          <IconButton onClick={handleSearchBtnClick}>
            <SearchIcon />
          </IconButton>
          <Avatar>NiFos</Avatar>
        </div>
      </div>
      <Divider />
    </Container>
  );
}
