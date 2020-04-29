import React from "react";
import styled from "styled-components";
import hexToRgba from "utils/hexToRgba";
import ReactDragList from "react-drag-list";
import { MoveDouble, Delete, Preview } from "assets/icons";

import "react-drag-list/assets/index.css";
import DeleteConfirmationAlert from "components/DeleteConfirmationAlert";

const AppendixList = ({
  onClickDeleteAppendix,
  onAppendixPreview,
  appendixData,
  onAppendixListUpdate,
  isSaving
}) => {
  return (
    <ItemListWrapper className="scrollElement">
      <ItemListTitle>Current Items</ItemListTitle>
      {isSaving ? null : (
        <ReactDragList
          dataSource={[...appendixData] || []}
          row={(record, index) => {
            return (
              <Row key={record._id}>
                <DragIcon />
                <Text title={record.title}>{record.title}</Text>
                <PreviewIcon
                  title="Preview"
                  onClick={() => onAppendixPreview(record.location)}
                >
                  <Preview />
                </PreviewIcon>
                <DeleteIconWrapper
                  onClick={() =>
                    DeleteConfirmationAlert({
                      onYesClick: () =>
                        onClickDeleteAppendix({
                          id: record._id,
                          index: index
                        })
                    })
                  }
                >
                  <DeleteIcon />
                </DeleteIconWrapper>
              </Row>
            );
          }}
          handles={false}
          rowClassName="search-tab"
          onUpdate={onAppendixListUpdate}
        />
      )}
    </ItemListWrapper>
  );
};

const ItemListTitle = styled.span`
  display: block;
  margin-bottom: 19px;
  ${props => props.theme.SNIPPETS.FONT_STYLE};
  font-weight: bold;
  color: ${props => props.theme.COLOR_PALLETE.BROWNISH_GREY};
`;

const DragIcon = styled(MoveDouble)`
  display: block;
  position: absolute;
  left: 10px;
  top: 10px;
  height: 14px;
  width: 9px;
`;

const PreviewIcon = styled.span`
  display: block;
  position: absolute;
  right: 35px;
  top: 8px;

  &:hover {
    cursor: pointer;
  }
`;

const DeleteIconWrapper = styled.div`
  display: block;
  position: absolute;
  right: 10px;
  top: 8px;

  &:hover {
    cursor: pointer;
  }
`;

const DeleteIcon = styled(Delete)`
  width: 13px;
  height: 13px;
`;

const Row = styled.div`
  position: relative;
  padding: 8px 0 9px 35px;
  display: block;
  box-sizing: border-box;
  background-color: ${props =>
    hexToRgba(props.theme.COLOR_PALLETE.COOL_BLUE, 0.09)};
  border-radius: 2px;
`;

const ItemListWrapper = styled.div`
  width: 30%;
  height: 386px;
  padding: 24px 30px;
  background-color: ${props => props.theme.COLOR.WHITE};
  ${props => props.theme.SNIPPETS.BOX_SHADOW};
  border-radius: 4px;
  box-sizing: border-box;
  overflow: auto;
  display: inline-block;
  vertical-align: top;
  .search-tab {
    margin-bottom: 20px;
  }

  @media (min-width: 1000px) and (max-width: 1024px) {
    min-width: 346px;
  }

  @media (max-width: 768px) {
    width: 39%;
  }

  .rc-draggable-list {
    cursor: move;
  }
`;

const Text = styled.span`
  display: block;
  padding-right: 60px;
  ${props => props.theme.SNIPPETS.FONT_STYLE};
  font-size: 12px;
  font-weight: bold;
  color: ${props => props.theme.COLOR_PALLETE.GREY};
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

export default AppendixList;
