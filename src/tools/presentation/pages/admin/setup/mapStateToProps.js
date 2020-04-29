//import network services
import {
  getAnnouncementData,
  fetchSingleAnnouncement,
  saveAnnouncementData,
  deleteAnnouncementData
} from "./services/announcement";

const mapStateToProps = state => {
  const { LOADING_ANNOUNCEMENT_DATA, SUCCESS_ANNOUNCEMENT_DATA } = state;

  return {
    ...LOADING_ANNOUNCEMENT_DATA,
    ...SUCCESS_ANNOUNCEMENT_DATA
  };
};

const actions = {
  getAnnouncementData,
  fetchSingleAnnouncement,
  saveAnnouncementData,
  deleteAnnouncementData
};

export { mapStateToProps, actions };
