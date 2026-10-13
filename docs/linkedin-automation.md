# LinkedIn publication workflow — €0

The weekly GitHub Action **Prepare LinkedIn draft (approval required)** reads the existing MUR cache, filters for positions published within the previous 7 days whose deadlines have not passed, excludes items flagged for review, and creates a GitHub Issue containing a suggested LinkedIn post and links to the official source notices.

## Review
Go to repository **Issues**, open the latest `LinkedIn draft approval` issue, verify every official source, edit the proposed copy, and manually publish to the **Research Radar Italy LinkedIn Page** or queue it in Buffer Free. Closing the issue can serve as a record of completed review but **does not publish anything**.

Run manually via **Actions → Prepare LinkedIn draft → Run workflow**. The scheduled job runs every Monday at 08:30 UTC. It will not create an issue if there are no eligible new positions. The site and MUR ingestion remain unchanged.

## Limitations / future integration
- Buffer and LinkedIn are **not connected** by this PR. The GitHub connector cannot authenticate to your external accounts.
- Fully automatic transfer to Buffer drafts requires the Buffer channel ID and approved API access. Keep tokens in GitHub Actions Secrets; never commit them.
- The approval safeguard should remain in place. A public GitHub issue may be visible to everyone because this repository is public. It contains only public opportunity data, not credentials.
- GitHub Actions scheduled runs may be delayed, and hosted-run quotas/policies can change.
- The campaign uses UTM parameters to enable attribution if website analytics are configured.
