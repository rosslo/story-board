import ApiClient from '../helpers/ApiClient';

export default {
  state: {
    releaseList: [],
    shrinkReleaseIds: []
  },
  actions: {
    shrinkRelease ({ commit }, id) {
      commit('shrinkRelease', id);
    },
    expandRelease ({ commit }, id) {
      commit('expandRelease', id);
    },
    shrinkOtherReleases ({ commit }, id) {
      commit('shrinkOtherReleases', id);
    },
    addRelease ({ commit, rootState }, data) {
      commit('addRelease');

      const mapId = rootState.map.map.id;

      ApiClient.POST(`/map/${mapId}/release`, {
        data
      }).then((id) => {
        data.id = id;

        commit('addReleaseSuc', data);
      }, (error) => {
        commit('addReleaseErr', error);
      });
    },
    updateRelease ({ commit, rootState }, data) {
      commit('updateRelease');

      const mapId = rootState.map.map.id;

      ApiClient.PATCH(`/map/${mapId}/release`, {
        data
      }).then((response) => {
        commit('updateReleaseSuc', data);
      }, (error) => {
        commit('updateReleaseErr', error);
      });
    },
    deleteRelease ({ commit, rootState }, id) {
      commit('deleteRelease');

      const mapId = rootState.map.map.id;

      ApiClient.DELETE(`/map/${mapId}/release/${id}`)
      .then((response) => {
        commit('deleteReleaseSuc', id);
      }, (error) => {
        commit('deleteReleaseErr', error);
      });

      // axios({
      //   method: 'delete',
      //   url: `${localServer}/release`,
      //   data: { id }
      // })

    }
  },
  getters: {
    releaseList: state => state.releaseList,
    shrinkReleaseIds: state => state.shrinkReleaseIds
  },
  mutations: {
    // getReleaseList (state) {
    //   state.getReleaseList = true;
    // },
    setReleaseList (state, list) {
      // state.getReleaseList = false;
      // state.getReleaseListSuc = true;
      state.releaseList = sortOrder(list);
    },
    // getReleaseListErr (state, err) {
    //   state.getReleaseList = false;
    //   state.getReleaseListErr = err;
    // },
    shrinkRelease (state, id) {
      const newShrinkIds = state.shrinkReleaseIds.slice();

      if (newShrinkIds.indexOf(id) === -1) {
        newShrinkIds.push(id);
      }

      state.shrinkReleaseIds = newShrinkIds;
    },
    expandRelease (state, id) {
      const newShrinkIds = state.shrinkReleaseIds.slice();
      const removeIndex = newShrinkIds.indexOf(id);
      newShrinkIds.splice(removeIndex, 1);

      state.shrinkReleaseIds = newShrinkIds;
    },
    shrinkOtherReleases (state, id) {
      const newShrinkIds = state.releaseList
        .filter(value => value.id !== id)
        .map(value => value.id);

      state.shrinkReleaseIds = newShrinkIds;
    },
    moveRelease (state, { id, way }) {
      const newReleaseList = state.releaseList.slice();
      const oldIndex = newReleaseList.findIndex(value => value.id === id);
      const release = newReleaseList[oldIndex];
      const newIndex = way === 'down' ? oldIndex + 1 : oldIndex - 1;

      newReleaseList[oldIndex] = newReleaseList[newIndex];
      newReleaseList[newIndex] = release;
      state.releaseList = newReleaseList;
    },
    addRelease (state) {
      state.addRelease = true;
    },
    addReleaseSuc (state, data) {
      const newReleaseList = state.releaseList.slice();
      newReleaseList.push(data);

      state.releaseList = sortOrder(newReleaseList);
      state.addRelease = false;
      state.addReleaseSuc = true;
    },
    addReleaseErr (state, err) {
      state.addRelease = false;
      state.addReleaseErr = err;
    },
    updateRelease (state) {
      state.updateRelease = true;
    },
    updateReleaseSuc (state, data) {
      const newReleaseList = state.releaseList.slice();

      data.forEach(value => {
        const index = newReleaseList.findIndex(release => release.id === value.id);

        Object.keys(value).forEach(key => {
          newReleaseList[index][key] = value[key];
        });
      });

      state.releaseList = sortOrder(newReleaseList);
      state.updateRelease = false;
      state.updateReleaseSuc = true;
    },
    updateReleaseErr (state, err) {
      state.updateRelease = false;
      state.updateReleaseErr = err;
    },
    deleteRelease (state) {
      state.deleteRelease = true;
    },
    deleteReleaseSuc (state, id) {
      const newReleaseList = state.releaseList.slice();
      const deleteIndex = newReleaseList.findIndex(value => value.id === id);
      newReleaseList.splice(deleteIndex, 1);

      state.releaseList = sortOrder(newReleaseList);
      state.deleteRelease = false;
      state.deleteReleaseSuc = true;
    },
    deleteReleaseErr (state, err) {
      state.deleteRelease = false;
      state.deleteReleaseErr = err;
    }
  }
};

function sortOrder (list) {
  return list.sort((a, b) => a.order - b.order);
}
