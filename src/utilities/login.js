export const navigateAfterLogin = (searchParams, navigate) => {
    navigate(searchParams.get("url") || "/group")
}