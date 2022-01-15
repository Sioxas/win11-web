import { Icon } from "@/components/Icon";
import Layout from "@/components/Layout";

export default function AddressBar() {
  return <Layout horizontal>
    <Layout horizontal className="folder-navigator">
      <div className="folder-navigator-icon">
        <Icon name='arrow-left' />
      </div>
      <div className="folder-navigator-icon">
        <Icon name='arrow-right' />
      </div>
      <div className="folder-navigator-icon">
        <Icon name='arrow-up' />
      </div>
    </Layout>
  </Layout>
}
