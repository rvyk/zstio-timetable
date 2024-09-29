import { create } from "zustand";

type ModalName =
  | "shortenedLessonsCalculator"
  | "freeRoomsSearch"
  | "errorDisplay";

interface ShortenedLessonsCalculatorState {
  isOpen: boolean;
}

interface FreeRoomsSearchState {
  isOpen: boolean;
  //   selectedRoom?: string;
}

interface ErrorDisplayState {
  isOpen: boolean;
  //   errorMessage?: string;
}

interface ModalsState {
  shortenedLessonsCalculator: ShortenedLessonsCalculatorState;
  freeRoomsSearch: FreeRoomsSearchState;
  errorDisplay: ErrorDisplayState;
}

interface ModalsStore {
  modals: Partial<ModalsState>;
  openModal: <T extends ModalName>(
    modalName: T,
    state?: Partial<Omit<ModalsState[T], "isOpen">>,
  ) => void;
  closeModal: (modalName: ModalName) => void;
  toggleModal: (modalName: ModalName) => void;
  setModalState: <T extends ModalName>(
    modalName: T,
    state: Partial<ModalsState[T]>,
  ) => void;
  getModalState: <T extends ModalName>(
    modalName: T,
  ) => ModalsState[T] | undefined;
}

const useModalsStore = create<ModalsStore>((set, get) => ({
  modals: {},
  openModal: (modalName, modalState = {}) =>
    set((state) => ({
      modals: {
        ...state.modals,
        [modalName]: {
          ...state.modals[modalName],
          ...modalState,
          isOpen: true,
        },
      },
    })),
  closeModal: (modalName) =>
    set((state) => ({
      modals: {
        ...state.modals,
        [modalName]: {
          ...state.modals[modalName],
          isOpen: false,
        },
      },
    })),
  toggleModal: (modalName) =>
    set((state) => {
      const currentState = state.modals[modalName];
      return {
        modals: {
          ...state.modals,
          [modalName]: {
            ...currentState,
            isOpen: !currentState?.isOpen,
          },
        },
      };
    }),
  setModalState: (modalName, modalState) =>
    set((state) => ({
      modals: {
        ...state.modals,
        [modalName]: {
          ...state.modals[modalName],
          ...modalState,
        },
      },
    })),
  getModalState: (modalName) => get().modals[modalName],
}));

export default useModalsStore;
