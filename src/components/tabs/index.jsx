import React from "react";
import Tab from "./components/tab";
import Container from "./container";
import styled from "styled-components";
const Tabs = props => {
  const { activeTab, children } = props;
  return (
    <Tabbed>
      <Tablist>
        {children.map(child => {
          const { label } = child.props;
          return (
            <Tab
              activeTab={activeTab}
              key={label}
              label={label}
              onClick={props.onClickTabItem}
            />
          );
        })}
      </Tablist>
      <TabContent>
        {children.map(child => {
          if (child.props.label !== activeTab) return undefined;
          return child.props.children;
        })}
      </TabContent>
    </Tabbed>
  );
};

const Tabbed = styled.div``;
const Tablist = styled.ul`
  margin-top: 77px;
  padding-left: 0;
`;
const TabContent = styled.div``;

export default Container(Tabs);
