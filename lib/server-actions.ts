type Asset = {
    name: string;
    browser_download_url: string;
}
export async function getLatestReleaseDownloadUrl() {
    const owner = 'CJH3139';
    const repo = 'skript-variables';

    const url = `https://api.github.com/repos/${owner}/${repo}/releases`;

    try {
        const response = await fetch(url, {
            next: {
                revalidate: 43200, // 12 hours
            }
        });

        if (!response.ok) {
            console.error(`GitHub API error: ${response.status} ${response.statusText}`);
            return Response.error();
        }

        const releases = await response.json();

        const latestRelease = releases[0];
        if (!latestRelease || !latestRelease.assets.length) {
            console.log("No releases or assets found.");
            return null;
        }

        const jarAsset: Asset = latestRelease.assets.find((asset: Asset) => asset.name.endsWith('.jar'));

        if (jarAsset) {
            console.log("Latest Download URL:", jarAsset.browser_download_url);
            return jarAsset.browser_download_url;
        } else {
            console.log("No .jar file found in the latest release.");
            return latestRelease.assets[0].browser_download_url;
        }

    } catch (error) {
        console.error("Failed to fetch release data:", error);
    }
}