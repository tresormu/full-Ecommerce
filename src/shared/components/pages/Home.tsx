import { Outlet } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Layout from "../layouts/layout";
import FirstDivision from "../ui/firstDivision";
import Categories from "../ui/Categories";
import DivStarter from "../ui/DivStarter";
import Products from "../ui/products";
import ContentWrapper from "../ui/contentLapup";
import { HomeDashboard } from "../ui/HomeDashboard";

export default function Home() {
  const { t } = useTranslation();
  return (
    <Layout>
      <ContentWrapper>
        <FirstDivision />
        <Categories />
        <HomeDashboard />

        <DivStarter description={t('home.featuredProducts')} />
        <Products random limit={3} />

        <DivStarter description={t('home.mensFashion')} />
        <Products random limit={6} />

        <DivStarter description={t('home.womensFashion')} />
        <Products random limit={6} />

        <DivStarter description={t('home.popular')} />
        <Products random limit={6} />
      </ContentWrapper>
      <Outlet />
    </Layout>
  );
}
