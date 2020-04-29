import React from "react";
import styled from "styled-components";

import Container from "./container";
import RepoManager from "components/repoManager";
import BgWrapper from "components/bgWrapper";
import FullPageLoader from "components/FullPageLoader";

const ModuleRepoComponent = ({
  gData,
  addNewCategory,
  editLevel,
  reorderModulesCategoryOnDragAndDrop,
  generateButtonNodeList,
  categoryOptions,
  onModuleSave,
  selectedModuleToEdit,
  isLoadingActive,
  resetSelectedModuleDetail,
  categoryIdToEdit,
  setResetCategory,
  deletedModuleId
}) => {
  // content repo config for admin module
  const contentRepoConfig = {
    header: {
      repoTitle: "Topics",
      addActive: true,
      search: true,
      addNewCategory: addNewCategory
    },
    levelManager: {
      moduleComponentHeader: true,
      expandCollapseAllFlag: true,
      modules: true,
      expandRepo: false,
      onEnable: editLevel
    },
    slidesGroupModuleManager: {
      modules: true,
      categoryOptions,
      onModuleSave,
      addNewCategory: addNewCategory
    }
  };

  const repoProps = {
    gData,
    contentRepoConfig,
    onSave: editLevel,
    reorderModulesCategoryOnDragAndDrop,
    generateButtonNodeList,
    selectedModuleToEdit,
    resetSelectedModuleDetail,
    categoryIdToEdit,
    setResetCategory,
    deletedModuleId
  };

  return (
    <>
      <AdminModuleRepo>
        {isLoadingActive && <FullPageLoader />}
        <RepoManager {...repoProps} />
      </AdminModuleRepo>
    </>
  );
};

const AdminModuleRepo = styled.div`
  * {
    box-sizing: border-box;
  }
`;

export default Container(BgWrapper(ModuleRepoComponent));
