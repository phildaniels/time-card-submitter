import { Footer } from '@mantine/core';

type AppFooterProps = {
  opened: boolean;
};

export const AppFooter = (): JSX.Element => {
  return (
    <Footer height={60} p="md" color="primary">
      Application footer
    </Footer>
  );
};
