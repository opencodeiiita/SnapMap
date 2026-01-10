import { StyleSheet } from "react-native";

const RegisterUserStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF5F5",
  },
  contentContainer: {
    paddingTop: 30,
    paddingBottom: 40,
    paddingHorizontal: 20,
  },
  headerWrapper: {
    alignItems: "center",
    marginBottom: 40,
    position: "relative",
  },
  header: {
    alignItems: "center",
    marginBottom: 0,
  },
  headerIcon: {
    width: 64,
    height: 64,
    marginBottom: 20,
  },
  title: {
    fontSize: 25,
    fontWeight: "800",
    fontFamily: "Semantic",
    color: "#1A1A1A",
    marginBottom: 12,
    textAlign: "center",
    lineHeight: 40,
    letterSpacing: -0.9,
  },
  subtitle: {
    fontSize: 17,
    fontWeight: "500",
    fontFamily: "Montserrat",
    color: "#666666",
    textAlign: "center",
    lineHeight: 20,
  },
  form: {
    gap: 14,
  },
  withIcon: {
    position: "relative",
  },
  inputGroup: {
    marginBottom: 8,
    position: "relative",
  },
  inputIcon: {
    position: "absolute",
    left: 3,
    top: 0,
    bottom: 0,
    width: 56,
    zIndex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  inputWithLeftIcon: {
    paddingLeft: 56,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    fontFamily: "Semantic",
    color: "#333",
    marginBottom: 8,
  },
  required: {
    color: "#FF4444",
  },
  input: {
    backgroundColor: "#FFFFFF",
    borderRadius: 28,
    paddingHorizontal: 20,
    paddingVertical: 14,
    fontSize: 15,
    fontFamily: "Montserrat",
    fontWeight: "500",
    color: "#333333",
    borderWidth: 0,
  },
  inputError: {
    borderWidth: 1,
    borderColor: "#FF4444",
  },
  errorText: {
    color: "#FF4444",
    fontSize: 12,
    marginTop: 6,
    marginLeft: 16,
  },
  submitButton: {
    backgroundColor: "#F5385D",
    borderRadius: 28,
    paddingVertical: 16,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 24,
    shadowColor: "#FF4444",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  submitButtonDisabled: {
    opacity: 0.6,
  },
  submitButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
    letterSpacing: 0.3,
  },
  dropdown: {
    backgroundColor: "#FFFFFF",
    borderRadius: 28,
    paddingHorizontal: 20,
    paddingVertical: 14,
    fontSize: 15,
    borderWidth: 0,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  dropdownText: {
    fontSize: 15,
    color: "#333333",
  },
  dropdownPlaceholder: {
    color: "#B0B0B0",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  dropdownModal: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    width: "80%",
    maxWidth: 400,
    maxHeight: "60%",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  dropdownOption: {
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  dropdownOptionSelected: {
    backgroundColor: "#FFF5F5",
  },
  dropdownOptionText: {
    fontSize: 15,
    color: "#333333",
  },
  dropdownOptionTextSelected: {
    color: "#FF4444",
    fontWeight: "600",
  },
});

export default RegisterUserStyles;