  //24.10.07.정율아
  <AppContainer>
            <Navbar>
              <div
                style={{
                  width: "100%",
                  height: "30px",
                  display: "flex",

                  position: "relative",
                  // border: '1px solid blue'
                  // margin: "0 auto",
                }}
              >
                <Link
                  to="/"
                  style={{
                    textDecoration: "none",
                    color: "#007bff",
                    fontSize: "20px",
                    fontWeight: "bold",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: "60px",
                    position: "absolute",

                    left: "27%",
                  }}
                >
                  Home
                </Link>
                <Link
                  to="/new"
                  style={{
                    textDecoration: "none",
                    color: "#f05264",
                    fontSize: "20px",
                    fontWeight: "bold",
                    width: "120px",
                    position: "absolute",

                    right: "17%",
                  }}
                >
                  New Post
                </Link>
              </div>
            </Navbar>
            <MainContent>
              <MoviesWrapper>
                <MoviesPage />
              </MoviesWrapper>
              <PostListWrapper>
                <PostList />
              </PostListWrapper>
            </MainContent>
          </AppContainer>