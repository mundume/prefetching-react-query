import * as React from "react";
import { useQuery, useQueryClient } from "react-query";

/**
 * Create a component that renders a list of issues
 * fetched from
 * `https://ui.dev/api/courses/react-query/issues`.
 *
 * Clicking on an issue should update the `issueNumber`
 * state, which renders the issue details.
 *
 * The issue details component should fetch from the
 * `https://ui.dev/api/courses/react-query/issues/:issueNumber`
 * endpoint. It should also render the comments fetched from
 * `https://ui.dev/api/courses/react-query/issues/:issueNumber/comments`.
 *
 * The issue details should be preloaded with data,
 * either through `initialData` or by priming
 * the cache with `queryClient.setQueryData`.
 * On the issue list component, hovering over
 * the issue should prefetch the comments.
 */
async function fetchIssues(queryClient) {
  const issues = await fetch(`https://ui.dev/api/courses/react-query/issues`);
  const data = await issues.json();
  data.forEach((issue) => {
    queryClient.setQueryData(["issues", issue.number], issue);
  });
  return data;
}
async function fetchIssueDetails(issueNumber) {
  const issueDetails = await fetch(
    `https://ui.dev/api/courses/react-query/issues/${issueNumber}`
  );
  const data = await issueDetails.json();
  return data;
}
async function fetchIssueComments(issueNumber) {
  const issueComments = await fetch(
    `https://ui.dev/api/courses/react-query/issues/${issueNumber}/comments`
  );
  const data = await issueComments.json();
  return data;
}

function Issues({ setIssueNumber }) {
  const queryClient = useQueryClient();
  const issuesQuery = useQuery(["issues"], () => fetchIssues(queryClient));

  // Implement the query here

  return (
    <div>
      <h1>Issues</h1>
      {issuesQuery.isLoading ? (
        "..."
      ) : (
        <ul>
          {issuesQuery.data.map((issue) => (
            <li key={issue.id}>
              <a
                href="#"
                onClick={() => setIssueNumber(issue.number)}
                onMouseEnter={() =>
                  queryClient.prefetchQuery(
                    ["issues", issue.number, "comments"],
                    () => fetchIssueComments(issue.number)
                  )
                }
              >
                {issue.title}
              </a>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function IssueDetails({ issueNumber, setIssueNumber }) {
  // Implement the query here
  const issueQuery = useQuery(["issues", issueNumber], () =>
    fetchIssueDetails(issueNumber)
  );

  return (
    <div>
      <h1>Issue Details</h1>
      <a href="#" onClick={() => setIssueNumber(null)}>
        Back to issues
      </a>
      <p>
        {issueQuery.isLoading ? (
          "..."
        ) : (
          <>
            #{issueQuery.data.number} {issueQuery.data.title}
          </>
        )}
      </p>
      <IssueComments issueNumber={issueNumber} />
    </div>
  );
}

function IssueComments({ issueNumber }) {
  // Implement the query here
  const commentsQuery = useQuery(["comments"], () =>
    fetchIssueComments(issueNumber)
  );

  return (
    <div>
      <h2>Comments</h2>
      {commentsQuery.isLoading ? (
        "..."
      ) : (
        <ul>
          {commentsQuery.data.map((comment) => (
            <li key={comment.id}>{comment.comment}</li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default function App() {
  const [issueNumber, setIssueNumber] = React.useState(null);
  if (issueNumber === null) {
    return <Issues setIssueNumber={setIssueNumber} />;
  } else {
    return (
      <IssueDetails issueNumber={issueNumber} setIssueNumber={setIssueNumber} />
    );
  }
}
